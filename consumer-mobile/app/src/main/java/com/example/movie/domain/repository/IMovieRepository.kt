package com.example.movie.domain.repository

import com.example.movie.data.remote.dto.MoviesDto

interface IMovieRepository {
    suspend fun getMovies(): MoviesDto
}