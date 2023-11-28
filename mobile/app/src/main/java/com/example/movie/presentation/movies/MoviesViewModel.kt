package com.example.movie.presentation.movies

import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.movie.domain.use_case.get_movies.GetMovieUseCase
import com.example.movie.util.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import javax.inject.Inject

@HiltViewModel
class MoviesViewModel @Inject constructor(private val getMovieUseCase: GetMovieUseCase) :
    ViewModel() {

    private val _state = mutableStateOf<MoviesState>(MoviesState())
    val state: State<MoviesState> = _state

    private var job: Job? = null

    init {
        getMovies()
    }

    private fun getMovies() {
        job?.cancel()
        job = getMovieUseCase.executeGetMovies().onEach {
            when (it) {
                is Resource.Success -> {
                    _state.value = MoviesState(movies = it.data ?: "")
                }

                is Resource.Error -> {
                    _state.value = MoviesState(error = it.message ?: "Error!")
                }

                is Resource.Loading -> {
                    _state.value = MoviesState(isLoading = true)
                }
            }
        }.launchIn(viewModelScope)
    }

    fun onEvent(event: MoviesEvent) {
        when (event) {
            is MoviesEvent.Search -> {
                getMovies()
            }
        }
    }

}