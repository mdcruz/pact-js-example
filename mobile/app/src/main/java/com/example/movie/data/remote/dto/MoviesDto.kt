package com.example.movie.data.remote.dto

import com.example.movie.domain.model.Movie

data class MoviesDto(
    val data: List<Movie>
)

//fun MoviesDto.toMovieList(): List<Movie> {
//    return Search.map { search ->
//        Movie(search.Poster, search.Title, search.Year, search.imdbID)
//    }
//}