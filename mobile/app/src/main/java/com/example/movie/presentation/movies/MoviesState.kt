package com.example.movie.presentation.movies

data class MoviesState(
    val isLoading: Boolean = false,
    val movies: Any = "",
    val error: String = "",
    val search: String = "Batman"
)