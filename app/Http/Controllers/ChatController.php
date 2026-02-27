<?php

namespace App\Http\Controllers;

use App\Models\Message as ModelsMessage;
use App\Models\User;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function index()
    {
        $users = User::where('id', '!=', auth()->user()->id)->get();
        return view('dashboard', compact('users'));
    }

    public function fetchMessages(Request $request)
    {
        $contact = User::findOrFail($request->contact_id);
        return response()->json([
            'contact' => $contact,
        ]);
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'contact_id' => ['required'],
            'message' => ['required', 'string'],
        ]);

        $message = Message::create([
            'from_id' => Auth::id(),
            'to_id' => $request->contact_id,
            'message' => $request->message,
        ]);

        return response()->json([
            'message' => $message,
        ]);
    }
}
