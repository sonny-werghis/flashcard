package com.werghis.flashcards;

import android.content.Context;

public class Globals {
	
	static boolean paidStatusKnown = false;
	static boolean isPaid = false;
	
	public static boolean isPaid(Context context) {
		
		if ( !paidStatusKnown ) {
			String pName = context.getPackageName();
			if (pName.endsWith("plus")) 
				isPaid = true;
			else
				isPaid = false;
			paidStatusKnown = true;
		} 
		return isPaid;
	}
}
