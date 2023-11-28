package com.example.movie.data.remote

import com.example.movie.data.remote.dto.MoviesDto
import retrofit2.http.GET

interface MovieAPI {
    @GET("/movies")
    suspend fun getMovies(): MoviesDto
}