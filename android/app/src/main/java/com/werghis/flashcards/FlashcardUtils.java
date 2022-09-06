package com.werghis.flashcards;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

public class FlashcardUtils {

    public static void updateWidgets(Context context) {
        Intent intent = new Intent(context.getApplicationContext(), FlashcardWidget.class);
        intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
        // Use an array and EXTRA_APPWIDGET_IDS instead of AppWidgetManager.EXTRA_APPWIDGET_ID,
        // since it seems the onUpdate() is only fired on that:
        AppWidgetManager widgetManager = AppWidgetManager.getInstance(context);
        int[] ids = widgetManager.getAppWidgetIds(new ComponentName(context, FlashcardWidget.class));

        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids);
        context.sendBroadcast(intent);
    }

    // Write the preference to the SharedPreferences object for this widget
    public static void savePref(String key, Context context, int appWidgetId, String text) {
        SharedPreferences.Editor prefs = context.getSharedPreferences(Constants.PREFS_NAME, 0).edit();
        prefs.putString( key, text);
        prefs.apply();
    }

    // Read the preference from the SharedPreferences object for this widget.
    public static String loadPref(String key, Context context, int appWidgetId) {
        SharedPreferences prefs = context.getSharedPreferences(Constants.PREFS_NAME, 0);
        String value = prefs.getString(key, null);
        return value;
    }
}
