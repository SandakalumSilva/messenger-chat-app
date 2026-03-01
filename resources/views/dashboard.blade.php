<x-app-layout>
    <div id="frame">
        @include('layouts.sidebar')
        <div class="content">
            <div class="blank-wrap">
                <div class="inner-blank-wrap">Select a conversation to start chatting</div>
            </div>
            <div class="loader d-none">
                <div class="loader-inner">
                    <l-line-spinner size="40" stroke="3" speed="1" color="black"></l-line-spinner>
                </div>
            </div>
            <div class="contact-profile">
                <img src="{{ asset('default-image/avatar.jpg') }}" alt="" />
                <p class="contact-name"></p>
                <div class="social-media">

                </div>
            </div>
            <div class="messages">
                <ul>
                    {{-- messages will be appended here by JavaScript --}}
                </ul>
            </div>
            <div class="message-input">
                <form action="" method="post" class="message-form">
                    @csrf
                    <div class="wrap">
                        <input autocomplete="off" type="text" name="message" class="message-box"
                            placeholder="Write your message..." />
                        <button type="submit" class="submit"><i class="fa fa-paper-plane"
                                aria-hidden="true"></i></button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <x-slot name="scripts">
        @vite(['resources/js/app.js', 'resources/js/message.js'])
    </x-slot>

</x-app-layout>
