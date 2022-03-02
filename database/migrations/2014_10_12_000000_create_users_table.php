<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('company');
            $table->string('c_uuid')->unique()->nullable();
            $table->string('t_token')->nullable();
            $table->string('sv_token')->unique()->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('user_type')->default('guest');
            $table->integer('user_group')->default(1);
            $table->boolean('whether_subscribed')->default(false);
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
