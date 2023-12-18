package com.example.movie.domain.repository

import com.example.movie.data.remote.dto.MoviesDto
import com.example.movie.domain.model.Add
import com.example.movie.domain.model.Movie
import com.google.gson.JsonObject
import org.json.JSONObject
import retrofit2.Call

interface IMovieRepository {
    suspend fun getMovies(): MoviesDto
    suspend fun addMovie(movie: Add): Movie
}