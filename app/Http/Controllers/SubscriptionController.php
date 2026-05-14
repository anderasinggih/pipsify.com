<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function upgrade(Request $request)
    {
        $user = $request->user();
        $user->is_pro = true;
        $user->save();

        return back()->with('success', 'Successfully upgraded to Pro!');
    }
}
