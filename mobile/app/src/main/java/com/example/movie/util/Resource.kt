package com.example.movie.util

import com.example.movie.domain.model.Movie

sealed class Resource<T>(val data: Any? = null, val message: String? = null) {
    class Success<T>(data: List<Movie>) : Resource<T>(data = data)
    class Error<T : Any>(message: String, data: T? = null) : Resource<T>(data = data, message = message)
    class Loading<T : Any>(data: T? = null) : Resource<T>(data = data)
}