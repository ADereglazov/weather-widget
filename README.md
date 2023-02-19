<p align="center">
    <img src="docs/example1.png" alt="img" width="294" height="343" >
    <img src="docs/example2.png" alt="img" width="294" height="343" >
</p>
<p align="center">
    <a href="https://weather-widget-alpha.vercel.app">Online demo</a>
</p>

---
### Environment variables in .env file

> **LANG** - language, for example: en, fr, ru  
> **UNITS** - units: standard, metric, imperial  
> **UPDATE_PERIOD_IN_HOURS** - local data update period in hours  
> **API_URL** - http://api.openweathermap.org/data/2.5/weather  
> **API_KEY** - you personal key from [free public API](http://api.openweathermap.org)  
> If you plan to use this: get your [own API key](https://openweathermap.org/appid#get) from OpenWeatherMap and replace the key in `.env`
---    
### Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
