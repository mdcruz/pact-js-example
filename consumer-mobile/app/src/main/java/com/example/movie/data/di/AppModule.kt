package com.example.movie.data.di

import com.example.movie.data.remote.MovieAPI
import com.example.movie.data.repository.MovieRepositoryImpl
import com.example.movie.domain.repository.IMovieRepository
import com.example.movie.util.Constants.BASE_URL
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    fun MovieClient(url: String = BASE_URL): MovieAPI {
        return Retrofit.Builder()
            .baseUrl(url)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(MovieAPI::class.java)
    }
    @Provides
    @Singleton
    fun provideMovieApp(): MovieAPI {
        return MovieClient()
    }

    @Provides
    @Singleton
    fun provideMovieRepository(api: MovieAPI): IMovieRepository {
        return MovieRepositoryImpl(api = api)
    }
}