<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;
use Aacotroneo\Saml2\Events\Saml2LoginEvent;
use Aacotroneo\Saml2\Events\Saml2LogoutEvent;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Events\GuestCreated;
use App\Events\ClientNeedsHelp;
use App\Listeners\NotifySlayvaultOfGuestAdded;
use App\Listeners\NotifyAgentsAboutTheIncident;

use App\Models\User;
use App\Models\Agent;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],

        GuestCreated::class => [
            NotifySlayvaultOfGuestAdded::class
        ]
        
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        Event::listen('Aacotroneo\Saml2\Events\Saml2LoginEvent', function (Saml2LoginEvent $event) {

            $messageId = $event->getSaml2Auth()->getLastMessageId();

            // Add your own code preventing reuse of a $messageId to stop replay attacks

            $user = $event->getSaml2User();
            $userData = [
                'id' => $user->getUserId(),
                'attributes' => $user->getAttributes(),
                'assertion' => $user->getRawSamlAssertion()
            ];

            /**
            * This is the attribute listing and types that are predetermined
            * clearly is following a standard naming for claims
            * "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
            * "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/privatepersonalidentifier"
            * "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
            * "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            * "http://schemas.xmlsoap.org/claims/Group"
            * "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
            * "http://schemas.xmlsoap.org/claims/CommonName"
            */
            if($userData['attributes']['http://schemas.xmlsoap.org/claims/Group'][0] == 1){
                $user = User::where('email', $userData['id'])->first();
            }else{
                $user = Agent::where('email', $userData['id'])->first();
            }

            $whetherSubscribedFlag = false;
            $subData = $userData['attributes']['Subscription'];

            foreach($subData as $appData){
                $processedAppData = json_decode($appData);
                if($processedAppData->id == config('app.service_id') && $processedAppData->subdomain == config('app.subdomain')){
                    $whetherSubscribedFlag = true;
                    break;
                }
            }

            if($whetherSubscribedFlag == true){
                if($user){
                    if($user->user_group == 1){
                        Auth::guard('web')->loginUsingId($user->id);
                    }elseif($user->user_group == 2){
                        Auth::guard('agent')->loginUsingId($user->id);
                    }
                }else{
                    if($userData['attributes']['http://schemas.xmlsoap.org/claims/Group'][0] == 1){
                        $user = new User;
                        $user->name = $userData['attributes']['http://schemas.xmlsoap.org/claims/CommonName'][0];
                        $user->email = $userData['attributes']['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'][0];
                        $user->user_type = $userData['attributes']['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'][0];
                        $user->user_group = $userData['attributes']['http://schemas.xmlsoap.org/claims/Group'][0];
                        $user->company = $userData['attributes']['Company'][0];
                        $user->uuid = $userData['attributes']['C_UUID'][0];
                        $user->save();


                        $token = $user->createToken($user->uuid);
                        $user->support_token = base64_encode($token->plainTextToken);
                        $user->slayvault_token = $userData['attributes']['Slayvault_token'][0];

                        $user->save();
                        
                        Auth::loginUsingId($user->id);

                    }elseif($userData['attributes']['http://schemas.xmlsoap.org/claims/Group'][0] == 2){
                        $agent = new Agent;
                        $agent->name = $userData['attributes']['http://schemas.xmlsoap.org/claims/CommonName'][0];
                        $agent->email = $userData['attributes']['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'][0];
                        $agent->user_type = $userData['attributes']['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'][0];
                        $agent->user_group = $userData['attributes']['http://schemas.xmlsoap.org/claims/Group'][0];
                        $agent->company = $userData['attributes']['Company'][0];
                        $agent->uuid = $userData['attributes']['C_UUID'][0];
                        $agent->ownership_id = $userData['attributes']['Ownership'][0];
                        $agent->save();

                        Auth::loginUsingId($agent->id);
                    }
                }
            }else{
                return redirect('/');
            }
        });

        Event::listen('Aacotroneo\Saml2\Events\Saml2LogoutEvent', function (Saml2LogoutEvent $event) {
            session()->invalidate();
            Auth::logout();
        });
    }
}
