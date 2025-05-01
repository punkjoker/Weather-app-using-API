<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WeatherController extends Controller
{
    public function getWeather(Request $request)
    {
        $city = $request->query('city');
        $units = $request->query('units', 'metric'); // metric = Celsius

        if (!$city) {
            return response()->json(['error' => 'City is required'], 400);
        }

        $apiKey = env('OPENWEATHER_API_KEY');

        // Get coordinates using Geocoding API
        $geoRes = Http::get("http://api.openweathermap.org/geo/1.0/direct", [
            'q' => $city,
            'limit' => 1,
            'appid' => $apiKey
        ]);

        if (empty($geoRes[0])) {
            return response()->json(['error' => 'City not found'], 404);
        }

        $lat = $geoRes[0]['lat'];
        $lon = $geoRes[0]['lon'];

        // Get weather using OneCall API
        $weatherRes = Http::get("https://api.openweathermap.org/data/2.5/onecall", [
            'lat' => $lat,
            'lon' => $lon,
            'units' => $units,
            'exclude' => 'minutely,hourly,alerts',
            'appid' => $apiKey
        ]);

        return response()->json($weatherRes->json());
    }
}
