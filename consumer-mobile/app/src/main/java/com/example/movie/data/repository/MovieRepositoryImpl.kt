package com.example.movie.data.repository

import com.example.movie.data.remote.MovieAPI
import com.example.movie.data.remote.dto.MoviesDto
import com.example.movie.domain.repository.IMovieRepository
import javax.inject.Inject

class MovieRepositoryImpl @Inject constructor(private val api: MovieAPI): IMovieRepository {
    override suspend fun getMovies(): MoviesDto {
        return api.getMovies()
    }
}