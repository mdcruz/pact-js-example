package com.example.movie.domain.model

data class Movie(
    val id: Int,
    override val name: String,
    override val year: Int,
): IMovie

data class Add(
    override val name: String,
    override val year: Int
): IMovie

interface IMovie {
    val name: String
    val year: Int
}
