package com.example.movie.data.remote

import com.example.movie.domain.model.Add
import com.example.movie.domain.model.Movie
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Headers
import retrofit2.http.POST
import org.json.JSONObject

interface MovieAPI {
    @GET("/movies")
    suspend fun getMovies(): List<Movie>

    @Headers("Content-Type: application/json")
    @POST("/movies")
    suspend fun addMovie(@Body movie: Add): Movie
}
