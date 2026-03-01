<?php

namespace App\Http\Controllers;

use App\Events\SendMessageEvent;
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
        $messages = Message::where(function ($query) use ($contact) {
            $query->where('from_id', Auth::id())
                ->where('to_id', $contact->id);
        })
            ->orWhere(function ($query) use ($contact) {
                $query->where('from_id', $contact->id)
                    ->where('to_id', Auth::id());
            })
            ->get();
        return response()->json([
            'contact' => $contact,
            'messages' => $messages,
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

        event(new SendMessageEvent($message->message, Auth::user()->id,$request->contact_id));

        return response()->json([
            'message' => $message,
        ]);
    }
}
