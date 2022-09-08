package com.werghis.flashcards;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import android.widget.LinearLayout;
import android.widget.RemoteViews;

import androidx.annotation.NonNull;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.ArrayList;

/**
 * Implementation of App Widget functionality.
 * App Widget Configuration implemented in
 */
public class FlashcardWidget extends AppWidgetProvider {

    private static final String ACTION_CLICK_NEXT = "action.CLICK_NEXT";
    private static PendingIntent pendingIntent;

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        Log.d(Constants.LOG_TAG, "Entered onUpdate");
        // There may be multiple widgets active, so update all of them
        for (int appWidgetId : appWidgetIds) {
            getData(context, appWidgetManager, appWidgetId);

            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.flashcard_widget);
            if (pendingIntent == null ) {
                Intent intent = new Intent(context, FlashcardWidgetService.class);
                intent.setAction(ACTION_CLICK_NEXT);
                intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);
                pendingIntent = PendingIntent.getBroadcast(context, 0, intent, PendingIntent.FLAG_IMMUTABLE);
            }
            Log.d(Constants.LOG_TAG, "Setting on click pending event");
            views.setOnClickPendingIntent(R.id.widgetCardTextView, pendingIntent);
            pendingIntent = null;
            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);

        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
        ComponentName thisAppWidgetComponentName = new ComponentName(context.getPackageName(), getClass().getName());
        int[] appWidgetIds = appWidgetManager.getAppWidgetIds(thisAppWidgetComponentName);

        if (ACTION_CLICK_NEXT.equals(intent.getAction())) {
            // Refresh the widget to display another card
            onUpdate(context, appWidgetManager, appWidgetIds);
        }
    }

    @Override
    public void onDeleted(Context context, int[] appWidgetIds) {
        // When the user deletes the widget, delete the preference associated with it.
        for (int appWidgetId : appWidgetIds) {
            // TODO
            // FlashcardWidgetConfigureActivity.deleteTitlePref(context, appWidgetId);
        }
    }

    @Override
    public void onEnabled(Context context) {
        // Enter relevant functionality for when the first widget is created
    }

    @Override
    public void onDisabled(Context context) {
        // Enter relevant functionality for when the last widget is disabled
    }

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager,
                                int appWidgetId, String title, String description) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.flashcard_widget);
        views.setTextViewText(R.id.widgetCardTitleTextView, title);
        views.setTextViewText(R.id.widgetCardTextView, description);

        int fontSize = 2;
        if ( FlashcardUtils.loadPref(Constants.PREF_FONTSIZE_KEY, context, appWidgetId) != null )
            fontSize = Integer.parseInt(FlashcardUtils.loadPref(Constants.PREF_FONTSIZE_KEY, context, appWidgetId));
        switch (fontSize) {
            case 1:
                views.setFloat(R.id.widgetCardTitleTextView, "setTextSize", 16);
                views.setFloat(R.id.widgetCardTextView, "setTextSize", 14);
                break;
            case 3:
                views.setFloat(R.id.widgetCardTitleTextView, "setTextSize", 20);
                views.setFloat(R.id.widgetCardTextView, "setTextSize", 18);
                break;
            default:
                views.setFloat(R.id.widgetCardTitleTextView, "setTextSize", 18);
                views.setFloat(R.id.widgetCardTextView, "setTextSize", 16);

        }
        Log.d(Constants.LOG_TAG, "Font Size: " + fontSize);

        // Set Alpha feature only works with android version S (31) or above
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            float alpha = 0.8f;
            if ( FlashcardUtils.loadPref(Constants.PREF_TRANSPARENCY_KEY, context, appWidgetId) != null )
                alpha = Float.parseFloat(FlashcardUtils.loadPref(Constants.PREF_TRANSPARENCY_KEY, context, appWidgetId));

            views.setFloat(R.id.widget, "setAlpha", alpha/10);
            Log.d(Constants.LOG_TAG, "Alpha: " + alpha / 10);
        }

        // Instruct the widget manager to update the widget
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    public static void getData(final Context context, final AppWidgetManager appWidgetManager, final int appWidgetId) {
        Log.d(Constants.LOG_TAG, "Reading data");
        FirebaseFirestore db = FirebaseFirestore.getInstance();

        // Determine whether to display a random card or the next card in the list
        String isRandomPref = FlashcardUtils.loadPref(Constants.PREF_RANDOMIZE_KEY, context,
                appWidgetId);
        final boolean isRandom = isRandomPref != null ? Boolean.parseBoolean(isRandomPref) : false;
        Log.d(Constants.LOG_TAG, "isRandom: " + isRandomPref);

        String prevIndexPref = FlashcardUtils.loadPref(Constants.PREF_CURR_INDEX_KEY, context,
                appWidgetId);
        final int prevIndex = prevIndexPref != null ? Integer.parseInt(prevIndexPref) : 0;

        db.collection("cards").orderBy("value").get().addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
            @Override
            public void onComplete(@NonNull Task<QuerySnapshot> task) {
                if (task.isSuccessful()) {
                    int size = task.getResult().size();
                    if (size == 0) {
                        updateAppWidget(context, appWidgetManager, appWidgetId, "Error", "No cards available");
                        return;
                    }
                    int nextIndex = 0;
                    if (isRandom) {
                        nextIndex = new java.util.Random().nextInt(size);
                    } else {
                        nextIndex = (prevIndex + 1) % size;
                    }
                    Log.d(Constants.LOG_TAG, "Next index: " + nextIndex);

                    FlashcardUtils.savePref(Constants.PREF_CURR_INDEX_KEY, context, appWidgetId,
                            Integer.toString(nextIndex));

                    // Can't think of a better wat to get to the item that we need
                    // but to scroll through because task getResult() returns an iterator
                    int count = 0;
                    for (QueryDocumentSnapshot document : task.getResult()) {
                        if (nextIndex != count) {
                            count = count + 1;
                            continue;
                        }
                        String value = document.getString("value");
                        String description = document.getString("description");

                        updateAppWidget(context, appWidgetManager, appWidgetId, value, description);
                        break;
                    }
                } else {
                    Log.w(Constants.LOG_TAG, "Error getting documents.", task.getException());
                    updateAppWidget(context, appWidgetManager, appWidgetId, "Error", "Cannot read cards");
                }
            }
        });
    }
}