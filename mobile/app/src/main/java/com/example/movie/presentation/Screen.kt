package com.example.movie.presentation
//Route
sealed class Screen(val route: String) {
    object MovieScreen : Screen("movie_screen")
    object MovieDetailScreen : Screen("movie_detail_screen")
}
