package com.example.movie

import com.atlassian.ta.wiremockpactgenerator.WireMockPactGenerator
import com.example.movie.data.di.AppModule.MovieClient
import com.github.tomakehurst.wiremock.WireMockServer
import com.github.tomakehurst.wiremock.common.ConsoleNotifier
import com.github.tomakehurst.wiremock.core.WireMockConfiguration.options
import com.marcinziolo.kotlin.wiremock.equalTo
import com.marcinziolo.kotlin.wiremock.get
import com.marcinziolo.kotlin.wiremock.returns
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import wiremock.org.hamcrest.MatcherAssert.assertThat
import wiremock.org.hamcrest.Matchers.equalTo
import java.net.ServerSocket

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class MoviesApiBiTest {
    private val port = ServerSocket(0).use { socket -> return@use socket.localPort }
    private val url
        get() = "http://localhost:$port"
    private var wireMockServer: WireMockServer? = WireMockServer(options().port(port).notifier(ConsoleNotifier(true)))

    @BeforeEach
    fun setUp() {
        wireMockServer?.start()
        val provider = System.getenv()
            .getOrDefault("PACT_PROVIDER", "BiWiremockMoviesAPI")
        wireMockServer!!.addMockServiceRequestListener(
            WireMockPactGenerator
                .builder("BiMoviesAndroidApp", provider)
                .build()
        )
    }
    @AfterEach
    fun afterEach() {
        wireMockServer?.resetAll()
        wireMockServer?.stop()
    }
    @Test
    fun getMoviesBi() {
        wireMockServer?.get {
            url equalTo "/movies"
        }!! returns {
            header = "Content-Type" to "application/json"
            statusCode = 200
            body = """{
            "data": [{ 
              "Id": 100, 
              "Name": "Frozen", 
              "Year": 2013 
            }]
            }
            """
        }

        // Act
        val movies = runBlocking { MovieClient(url).getMovies()};

        // Assert
        assertThat(movies.data[0].Id, equalTo(100))
    }
}
