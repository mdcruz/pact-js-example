package com.example.movie.domain.use_case.get_movies

import com.example.movie.data.remote.dto.Search
import com.example.movie.domain.repository.IMovieRepository
import com.example.movie.util.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import retrofit2.HttpException
import java.io.IOError
import javax.inject.Inject

class GetMovieUseCase @Inject constructor(private val repository: IMovieRepository) {

    fun executeGetMovies(): Flow<Resource<List<Search>>> = flow {
        try {
            emit(Resource.Loading())
            val movieList = repository.getMovies()
            if (movieList.data.isNotEmpty()) {
                emit(Resource.Success(movieList.data))
            } else {
                emit(Resource.Error(message = "No movie found!"))
            }
        } catch (e: IOError) {
            emit(Resource.Error(message = "No internet connection"))
        } catch (e: HttpException) {
            emit(Resource.Error(message = e.localizedMessage ?: "Error"))
        }
    }
}