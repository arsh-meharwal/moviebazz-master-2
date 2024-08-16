const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MmUwNjE0MGVmZTU3MWZmZjg4Mzg3MTg2NDEwOGE1MyIsIm5iZiI6MTcyMTA1Nzk5Ni45NzM0NTcsInN1YiI6IjY2Nzg1YTFjYTEwZWRhZTAzYmYyNTIxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.io8ZLtQiCN7Zv1cjOkJ_e4C4WJP2VMNluoxc_4bdMCs",
  },
};

const options2 = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "5981fcc46fmsh65a91eac3d1aed0p116ec6jsnf253a9ea2c40",
    "x-rapidapi-host": "mdblist.p.rapidapi.com",
  },
};

const options3 = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "5981fcc46fmsh65a91eac3d1aed0p116ec6jsnf253a9ea2c40",
    "x-rapidapi-host": "movie_torrent_api1.p.rapidapi.com",
  },
};

export const getTopRatedMovies = async (page) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`,
      options
    );
    const res = response.json();
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const getTopRatedTv = async (page) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=${page}`,
      options
    );
    const res = response.json();
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const getTrendingMovie = async (page) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${page}`,
      options
    );
    const res = response.json();
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const getTrendingTv = async (page) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/trending/tv/week?language=en-US&page=${page}`,
      options
    );
    const res = response.json();
    return res;
  } catch (error) {
    return error;
  }
};
export const getProfileDetail = async (id) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/person/${id}`,
      options
    );
    const response = res.json();
    return response;
  } catch (error) {
    return err;
  }
};
export const getProfileImages = async (id) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/person/${id}/images`,
      options
    );
    const response = res.json();
    return response;
  } catch (error) {
    return err;
  }
};
export const getProfileCredits = async (id) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/person/${id}/combined_credits`,
      options
    );
    const response = res.json();
    return response;
  } catch (error) {
    return err;
  }
};
export const getTvDetail = async (id) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${id}?language=en-US`,
      options
    );
    const response = res.json();
    return response;
  } catch (error) {
    return err;
  }
};
export const getMovieDetail = async (id) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
      options
    );
    const response = res.json();
    return response;
  } catch (error) {
    return err;
  }
};
export const getSimilarTv = async (id) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/recommendations?language=en-US&page=1`,
      options
    );
    const response = res.json();
    return response;
  } catch (error) {
    return err;
  }
};
export const getSimilarMovie = async (id) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`,
      options
    );
    const response = res.json();
    return response;
  } catch (error) {
    return err;
  }
};
export const getTvImages = async (id) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/images`,
      options
    );
    const response = res.json();
    return response;
  } catch (error) {
    return err;
  }
};
export const getMovieImages = async (id) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/images`,
      options
    );
    const response = res.json();
    return response;
  } catch (error) {
    return err;
  }
};
export const getTvReviews = async (id) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/reviews?languages=en-US&page=1`,
      options
    );
    const response = res.json();
    return response;
  } catch (error) {
    return err;
  }
};
export const getMovieReviews = async (id) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/reviews?languages=en-US&page=1`,
      options
    );
    const response = res.json();
    return response;
  } catch (error) {
    return err;
  }
};
export const getTvVideos = async (id) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/videos?languages=en-US`,
      options
    );
    const response = res.json();
    return response;
  } catch (error) {
    return err;
  }
};
export const getMovieVideos = async (id) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?languages=en-US`,
      options
    );
    const response = res.json();
    return response;
  } catch (error) {
    return err;
  }
};
export const getSearchQuery = async (query) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=true&language=en-US&page=1`,
      options
    );
    const response = res.json();
    return response;
  } catch (error) {
    return err;
  }
};
export const getTvCredits = async (id) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/credits?language=en-US`,
      options
    );
    const response = res.json();
    return response;
  } catch (error) {
    return err;
  }
};
export const getTVProviders = async (id) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/watch/providers`,
      options
    );
    const response = res.json();
    return response;
  } catch (error) {
    return err;
  }
};
export const getMovieCredits = async (id) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`,
      options
    );
    const response = res.json();
    return response;
  } catch (error) {
    return err;
  }
};
export const getFranchiseDetail = async (id) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/collection/${id}`,
      options
    );
    const response = res.json();
    return response;
  } catch (error) {
    return err;
  }
};
export const getTvSeasonDetail = async (id, season) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/season/${season}?language=en-US`,
      options
    );
    const response = res.json();
    return response;
  } catch (error) {
    return err;
  }
};
export const getAllRatings = async (id) => {
  try {
    const response = await fetch(
      `https://mdblist.p.rapidapi.com/?tm=${id}`,
      options2
    );
    const res = response.json();
    return res;
  } catch (error) {
    return err;
  }
};
export const getAllRatingsTv = async (id) => {
  try {
    const response = await fetch(
      `https://mdblist.p.rapidapi.com/?tm=${id}&m=show`,
      options2
    );
    const res = response.json();
    return res;
  } catch (error) {
    return err;
  }
};
export const getTorrents = async (name) => {
  const url = `https://movie_torrent_api1.p.rapidapi.com/search/twisters`;
  const option = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "5981fcc46fmsh65a91eac3d1aed0p116ec6jsnf253a9ea2c40",
      "x-rapidapi-host": "movie_torrent_api1.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, option);
    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};
