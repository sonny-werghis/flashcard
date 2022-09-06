package com.werghis.flashcards;

import android.appwidget.AppWidgetManager;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.widget.RemoteViews;

public class FlashcardWidgetService extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d(Constants.LOG_TAG, "OnReceive Event : " + intent.getAction());

        // simply update the widget. The widget will pick the next card
        FlashcardUtils.updateWidgets(context);
    }
}
