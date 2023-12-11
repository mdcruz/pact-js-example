package com.example.movie

import au.com.dius.pact.consumer.MockServer
import au.com.dius.pact.consumer.dsl.DslPart
import au.com.dius.pact.consumer.dsl.PactDslJsonBody
import au.com.dius.pact.consumer.dsl.PactDslWithProvider
import au.com.dius.pact.consumer.junit5.PactConsumerTestExt
import au.com.dius.pact.consumer.junit5.PactTestFor
import au.com.dius.pact.consumer.junit5.ProviderType
import au.com.dius.pact.core.model.V4Pact
import au.com.dius.pact.core.model.annotations.Pact
import com.example.movie.data.di.AppModule.MovieClient
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.extension.ExtendWith


@ExtendWith(
    PactConsumerTestExt::class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class MoviesApiPactTest {
    @Pact(provider = "MoviesAPI", consumer = "movies-android-app")
    fun createPact(builder: PactDslWithProvider): V4Pact {
        val body: DslPart = PactDslJsonBody()
            .array("data")
            .`object`()
            .integerType("Id")
            .stringType("Name")
            .integerType("Year")
        return builder
            .given("a movie exists")
            .uponReceiving("a request for all movies")
            .path("/movies")
            .method("GET")
            .willRespondWith()
            .status(200)
            .headers(mapOf("Content-type" to "application/json"))
            .body(body)
            .toPact(V4Pact::class.java)
    }

    @Test
    @PactTestFor(providerName="MoviesAPI", pactMethod = "createPact", providerType = ProviderType.SYNCH)
    fun `should get movies response`(mockServer: MockServer) {
        var client = MovieClient(mockServer.getUrl())
        val response = runBlocking { client.getMovies()}
        assertTrue(response.data.isNotEmpty())
    }

}