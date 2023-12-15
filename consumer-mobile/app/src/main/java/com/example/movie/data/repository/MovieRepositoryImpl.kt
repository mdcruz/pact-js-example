package com.example.movie.data.repository

import com.example.movie.data.remote.MovieAPI
import com.example.movie.data.remote.dto.MoviesDto
import com.example.movie.domain.model.Add
import com.example.movie.domain.model.Movie
import com.example.movie.domain.repository.IMovieRepository
import com.google.gson.JsonObject
import org.json.JSONObject
import javax.inject.Inject

class MovieRepositoryImpl @Inject constructor(private val api: MovieAPI): IMovieRepository {
    override suspend fun getMovies(): MoviesDto {
        return MoviesDto(api.getMovies())
    }

    override suspend fun addMovie(movie: Add): Movie {
        return api.addMovie(movie)
    }
}