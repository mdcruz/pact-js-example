package com.example.movie

import android.app.Application
import dagger.hilt.android.HiltAndroidApp
//1st creating Application class and declaring annotations
//It is important for Dependency Injection
@HiltAndroidApp
class MovieApplication : Application() {
}
