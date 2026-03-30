export type Locale = "en" | "he" | "ru" | "ar";

export const RTL_LOCALES: Locale[] = ["he", "ar"];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  he: "עברית",
  ru: "Русский",
  ar: "العربية",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: "🌍",
  he: "🇮🇱",
  ru: "🇷🇺",
  ar: "🇸🇦",
};

type TranslationKeys = {
  // Navigation
  nav_home: string;
  nav_cars: string;
  nav_news: string;
  nav_compare: string;
  nav_copilot: string;
  nav_my_list: string;
  nav_videos: string;
  nav_sign_in: string;
  nav_sign_out: string;
  nav_browse: string;
  nav_find_car: string;

  // Search
  search_placeholder: string;
  search_cars_placeholder: string;
  search_no_results: string;
  searching: string;

  // Homepage
  home_popular: string;
  home_trending: string;
  home_tesla_fleet: string;
  home_expert_reviews: string;
  home_byd_collection: string;
  home_comparisons: string;
  home_premium: string;
  home_electric_revolution: string;
  home_browse_2026: string;
  home_browse_2026_desc: string;
  home_find_your_car: string;
  home_all_videos: string;
  home_all_videos_desc: string;
  home_watch_now: string;
  home_latest_news: string;
  home_see_all: string;
  home_continue_watching: string;

  // Cars page
  cars_title: string;
  cars_description: string;
  cars_vehicle_specs: string;
  cars_engines: string;
  cars_epa_ratings: string;
  cars_safety_ratings: string;
  cars_browse_full_db: string;
  cars_popular_2026: string;

  // Car detail
  car_full_specs: string;
  car_overview: string;
  car_trims: string;
  car_compare: string;
  car_price: string;
  car_range: string;
  car_battery: string;
  car_type: string;
  car_horsepower: string;
  car_acceleration: string;
  car_top_speed: string;
  car_drivetrain: string;
  car_fuel_economy: string;
  car_dimensions: string;
  car_weight: string;
  car_cargo: string;
  car_seats: string;
  car_warranty: string;
  car_compare_with: string;
  car_select_region: string;
  car_local_price: string;
  car_should_buy: string;
  car_estimated_price: string;
  car_ai_analysis: string;
  car_latest_news: string;
  car_match: string;
  car_price_tbd: string;

  // Regions
  region_global: string;
  region_israel: string;
  region_russia: string;
  region_arabic: string;
  region_all: string;

  // Compare
  compare_title: string;
  compare_select_cars: string;
  compare_car_1: string;
  compare_car_2: string;
  compare_go: string;
  compare_verdict: string;

  // Videos
  videos_title: string;
  videos_description: string;

  // Common
  common_loading: string;
  common_error: string;
  common_retry: string;
  common_back: string;
  common_close: string;
  common_share: string;
  common_save: string;
  common_view_all: string;
  common_from: string;
  common_year: string;

  // Footer
  footer_questions: string;
  footer_faq: string;
  footer_help: string;
  footer_account: string;
  footer_media: string;
  footer_investors: string;
  footer_jobs: string;
  footer_ways_to_watch: string;
  footer_terms: string;
  footer_privacy: string;
  footer_cookies: string;
  footer_corporate: string;

  // Sign in
  sign_in_title: string;
  sign_in_email: string;
  sign_in_name: string;
  sign_in_next: string;
  sign_in_new: string;
  sign_in_signup: string;

  // Car finder filters
  filter_make: string;
  filter_model: string;
  filter_year: string;
  filter_type: string;
  filter_all_makes: string;
  filter_all_models: string;
  filter_search: string;
  filter_clear: string;
  filter_results: string;
};

const en: TranslationKeys = {
  nav_home: "Home",
  nav_cars: "Cars",
  nav_news: "News",
  nav_compare: "Compare",
  nav_copilot: "AI Copilot",
  nav_my_list: "My List",
  nav_videos: "Videos",
  nav_sign_in: "Sign In",
  nav_sign_out: "Sign out of AutoFlix",
  nav_browse: "Browse",
  nav_find_car: "Find Car",

  search_placeholder: "Titles, cars, genres",
  search_cars_placeholder: "Search 2026 cars \u2014 type make or model...",
  search_no_results: "No results found",
  searching: "Searching...",

  home_popular: "Popular on AutoFlix",
  home_trending: "Trending Now",
  home_tesla_fleet: "Tesla Fleet",
  home_expert_reviews: "Expert Reviews",
  home_byd_collection: "BYD Collection",
  home_comparisons: "Head-to-Head Comparisons",
  home_premium: "Premium & Luxury",
  home_electric_revolution: "Electric Revolution",
  home_browse_2026: "Browse Every 2026 Car",
  home_browse_2026_desc: "Full specs, all trims, regional pricing for US, Israel, Russia & UAE",
  home_find_your_car: "Find Your Car \u2192",
  home_all_videos: "All Car Videos",
  home_all_videos_desc: "Latest reviews, comparisons & news from YouTube and more",
  home_watch_now: "Watch Now \u2192",
  home_latest_news: "Latest Automotive News",
  home_see_all: "See all \u2192",
  home_continue_watching: "Continue Watching",

  cars_title: "Find Your Car",
  cars_description: "Browse every 2026 car on the market. Select make and model to see full technical specs, all trim variants, regional pricing, fuel economy, and EPA ratings.",
  cars_vehicle_specs: "Vehicle Specs",
  cars_engines: "Engines",
  cars_epa_ratings: "EPA Ratings",
  cars_safety_ratings: "Safety Ratings",
  cars_browse_full_db: "Browse Full Database \u2192",
  cars_popular_2026: "Popular 2026 Models",

  car_full_specs: "Full Specs",
  car_overview: "Overview",
  car_trims: "Trims & Variants",
  car_compare: "Compare",
  car_price: "Price",
  car_range: "Range",
  car_battery: "Battery",
  car_type: "Type",
  car_horsepower: "Horsepower",
  car_acceleration: "0\u2013100 km/h",
  car_top_speed: "Top Speed",
  car_drivetrain: "Drivetrain",
  car_fuel_economy: "Fuel Economy",
  car_dimensions: "Dimensions",
  car_weight: "Weight",
  car_cargo: "Cargo",
  car_seats: "Seats",
  car_warranty: "Warranty",
  car_compare_with: "Compare with another car",
  car_select_region: "Select Your Region",
  car_local_price: "Local Price",
  car_should_buy: "Should you buy in",
  car_estimated_price: "Estimated starting price in",
  car_ai_analysis: "AI Analysis",
  car_latest_news: "Latest News",
  car_match: "Match",
  car_price_tbd: "Price TBD",

  region_global: "Global / US",
  region_israel: "Israel",
  region_russia: "Russia",
  region_arabic: "Arabic World",
  region_all: "All Regions",

  compare_title: "Compare Cars",
  compare_select_cars: "Select two cars to compare",
  compare_car_1: "Car 1",
  compare_car_2: "Car 2",
  compare_go: "Compare",
  compare_verdict: "AI Verdict",

  videos_title: "All Car Videos",
  videos_description: "Latest reviews, comparisons, and automotive news from YouTube and more",

  common_loading: "Loading...",
  common_error: "Something went wrong",
  common_retry: "Retry",
  common_back: "Back",
  common_close: "Close",
  common_share: "Share",
  common_save: "Save",
  common_view_all: "View All",
  common_from: "From",
  common_year: "Year",

  footer_questions: "Questions? Contact us.",
  footer_faq: "FAQ",
  footer_help: "Help Center",
  footer_account: "Account",
  footer_media: "Media Center",
  footer_investors: "Investor Relations",
  footer_jobs: "Jobs",
  footer_ways_to_watch: "Ways to Watch",
  footer_terms: "Terms of Use",
  footer_privacy: "Privacy",
  footer_cookies: "Cookie Preferences",
  footer_corporate: "Corporate Information",

  sign_in_title: "Sign In",
  sign_in_email: "Email address",
  sign_in_name: "Your display name",
  sign_in_next: "Next",
  sign_in_new: "New to AutoFlix?",
  sign_in_signup: "Sign up now",

  filter_make: "Make",
  filter_model: "Model",
  filter_year: "Year",
  filter_type: "Type",
  filter_all_makes: "All Makes",
  filter_all_models: "All Models",
  filter_search: "Search",
  filter_clear: "Clear",
  filter_results: "results",
};

const he: TranslationKeys = {
  nav_home: "\u05d1\u05d9\u05ea",
  nav_cars: "\u05e8\u05db\u05d1\u05d9\u05dd",
  nav_news: "\u05d7\u05d3\u05e9\u05d5\u05ea",
  nav_compare: "\u05d4\u05e9\u05d5\u05d5\u05d0\u05d4",
  nav_copilot: "\u05d9\u05d5\u05e2\u05e5 AI",
  nav_my_list: "\u05d4\u05e8\u05e9\u05d9\u05de\u05d4 \u05e9\u05dc\u05d9",
  nav_videos: "\u05e1\u05e8\u05d8\u05d5\u05e0\u05d9\u05dd",
  nav_sign_in: "\u05d4\u05ea\u05d7\u05d1\u05e8\u05d5\u05ea",
  nav_sign_out: "\u05d4\u05ea\u05e0\u05ea\u05e7\u05d5\u05ea \u05de-AutoFlix",
  nav_browse: "\u05e2\u05d9\u05d5\u05df",
  nav_find_car: "\u05de\u05e6\u05d0 \u05e8\u05db\u05d1",

  search_placeholder: "\u05db\u05d5\u05ea\u05e8\u05d5\u05ea, \u05e8\u05db\u05d1\u05d9\u05dd, \u05e7\u05d8\u05d2\u05d5\u05e8\u05d9\u05d5\u05ea",
  search_cars_placeholder: "\u05d7\u05e4\u05e9 \u05e8\u05db\u05d1\u05d9 2026 \u2014 \u05d4\u05e7\u05dc\u05d3 \u05d9\u05e6\u05e8\u05df \u05d0\u05d5 \u05d3\u05d2\u05dd...",
  search_no_results: "\u05dc\u05d0 \u05e0\u05de\u05e6\u05d0\u05d5 \u05ea\u05d5\u05e6\u05d0\u05d5\u05ea",
  searching: "\u05de\u05d7\u05e4\u05e9...",

  home_popular: "\u05e4\u05d5\u05e4\u05d5\u05dc\u05e8\u05d9 \u05d1-AutoFlix",
  home_trending: "\u05d8\u05e8\u05e0\u05d3\u05d9 \u05e2\u05db\u05e9\u05d9\u05d5",
  home_tesla_fleet: "\u05e6\u05d9 \u05d8\u05e1\u05dc\u05d4",
  home_expert_reviews: "\u05d1\u05d9\u05e7\u05d5\u05e8\u05d5\u05ea \u05de\u05d5\u05de\u05d7\u05d9\u05dd",
  home_byd_collection: "\u05e7\u05d5\u05dc\u05e7\u05e6\u05d9\u05d9\u05ea BYD",
  home_comparisons: "\u05d4\u05e9\u05d5\u05d5\u05d0\u05d5\u05ea \u05e4\u05e0\u05d9\u05dd \u05de\u05d5\u05dc \u05e4\u05e0\u05d9\u05dd",
  home_premium: "\u05e4\u05e8\u05d9\u05de\u05d9\u05d5\u05dd \u05d5\u05dc\u05d5\u05e7\u05e1",
  home_electric_revolution: "\u05d4\u05de\u05d4\u05e4\u05db\u05d4 \u05d4\u05d7\u05e9\u05de\u05dc\u05d9\u05ea",
  home_browse_2026: "\u05e2\u05d9\u05d9\u05df \u05d1\u05db\u05dc \u05e8\u05db\u05d1\u05d9 2026",
  home_browse_2026_desc: "\u05de\u05e4\u05e8\u05d8 \u05de\u05dc\u05d0, \u05db\u05dc \u05d4\u05d2\u05e8\u05e1\u05d0\u05d5\u05ea, \u05de\u05d7\u05d9\u05e8\u05d9\u05dd \u05d0\u05d6\u05d5\u05e8\u05d9\u05d9\u05dd \u05dc\u05d0\u05e8\u05d4\"\u05d1, \u05d9\u05e9\u05e8\u05d0\u05dc, \u05e8\u05d5\u05e1\u05d9\u05d4 \u05d5\u05d0\u05d9\u05d7\u05d5\u05d3 \u05d4\u05d0\u05de\u05d9\u05e8\u05d5\u05d9\u05d5\u05ea",
  home_find_your_car: "\u05de\u05e6\u05d0 \u05d0\u05ea \u05d4\u05e8\u05db\u05d1 \u05e9\u05dc\u05da \u2190",
  home_all_videos: "\u05db\u05dc \u05e1\u05e8\u05d8\u05d5\u05e0\u05d9 \u05d4\u05e8\u05db\u05d1",
  home_all_videos_desc: "\u05d1\u05d9\u05e7\u05d5\u05e8\u05d5\u05ea, \u05d4\u05e9\u05d5\u05d5\u05d0\u05d5\u05ea \u05d5\u05d7\u05d3\u05e9\u05d5\u05ea \u05de\u05d9\u05d5\u05d8\u05d9\u05d5\u05d1 \u05d5\u05e2\u05d5\u05d3",
  home_watch_now: "\u05e6\u05e4\u05d4 \u05e2\u05db\u05e9\u05d9\u05d5 \u2190",
  home_latest_news: "\u05d7\u05d3\u05e9\u05d5\u05ea \u05e8\u05db\u05d1 \u05d0\u05d7\u05e8\u05d5\u05e0\u05d5\u05ea",
  home_see_all: "\u05e8\u05d0\u05d4 \u05d4\u05db\u05dc \u2190",
  home_continue_watching: "\u05d4\u05de\u05e9\u05da \u05e6\u05e4\u05d9\u05d9\u05d4",

  cars_title: "\u05de\u05e6\u05d0 \u05d0\u05ea \u05d4\u05e8\u05db\u05d1 \u05e9\u05dc\u05da",
  cars_description: "\u05e2\u05d9\u05d9\u05df \u05d1\u05db\u05dc \u05e8\u05db\u05d1\u05d9 2026 \u05d1\u05e9\u05d5\u05e7. \u05d1\u05d7\u05e8 \u05d9\u05e6\u05e8\u05df \u05d5\u05d3\u05d2\u05dd \u05dc\u05e6\u05e4\u05d9\u05d9\u05d4 \u05d1\u05de\u05e4\u05e8\u05d8 \u05d8\u05db\u05e0\u05d9 \u05de\u05dc\u05d0, \u05db\u05dc \u05d4\u05d2\u05e8\u05e1\u05d0\u05d5\u05ea, \u05de\u05d7\u05d9\u05e8\u05d9\u05dd \u05d0\u05d6\u05d5\u05e8\u05d9\u05d9\u05dd \u05d5\u05d3\u05d9\u05e8\u05d5\u05d2\u05d9 EPA.",
  cars_vehicle_specs: "\u05de\u05e4\u05e8\u05d8 \u05e8\u05db\u05d1",
  cars_engines: "\u05de\u05e0\u05d5\u05e2\u05d9\u05dd",
  cars_epa_ratings: "\u05d3\u05d9\u05e8\u05d5\u05d2\u05d9 EPA",
  cars_safety_ratings: "\u05d3\u05d9\u05e8\u05d5\u05d2\u05d9 \u05d1\u05d8\u05d9\u05d7\u05d5\u05ea",
  cars_browse_full_db: "\u05e2\u05d9\u05d9\u05df \u05d1\u05de\u05e1\u05d3 \u05e0\u05ea\u05d5\u05e0\u05d9\u05dd \u05de\u05dc\u05d0 \u2190",
  cars_popular_2026: "\u05d3\u05d2\u05de\u05d9 2026 \u05e4\u05d5\u05e4\u05d5\u05dc\u05e8\u05d9\u05d9\u05dd",

  car_full_specs: "\u05de\u05e4\u05e8\u05d8 \u05de\u05dc\u05d0",
  car_overview: "\u05e1\u05e7\u05d9\u05e8\u05d4",
  car_trims: "\u05d2\u05e8\u05e1\u05d0\u05d5\u05ea \u05d5\u05d2\u05e8\u05e1\u05d0\u05d5\u05ea",
  car_compare: "\u05d4\u05e9\u05d5\u05d5\u05d0\u05d4",
  car_price: "\u05de\u05d7\u05d9\u05e8",
  car_range: "\u05d8\u05d5\u05d5\u05d7",
  car_battery: "\u05e1\u05d5\u05dc\u05dc\u05d4",
  car_type: "\u05e1\u05d5\u05d2",
  car_horsepower: "\u05db\u05d5\u05d7 \u05e1\u05d5\u05e1",
  car_acceleration: "0\u2013100 \u05e7\u05de\"\u05e9",
  car_top_speed: "\u05de\u05d4\u05d9\u05e8\u05d5\u05ea \u05de\u05e7\u05e1\u05d9\u05de\u05dc\u05d9\u05ea",
  car_drivetrain: "\u05d4\u05e0\u05e2\u05d4",
  car_fuel_economy: "\u05e6\u05e8\u05d9\u05db\u05ea \u05d3\u05dc\u05e7",
  car_dimensions: "\u05de\u05d9\u05d3\u05d5\u05ea",
  car_weight: "\u05de\u05e9\u05e7\u05dc",
  car_cargo: "\u05ea\u05d0 \u05de\u05d8\u05e2\u05df",
  car_seats: "\u05de\u05d5\u05e9\u05d1\u05d9\u05dd",
  car_warranty: "\u05d0\u05d7\u05e8\u05d9\u05d5\u05ea",
  car_compare_with: "\u05d4\u05e9\u05d5\u05d5\u05d4 \u05e2\u05dd \u05e8\u05db\u05d1 \u05d0\u05d7\u05e8",
  car_select_region: "\u05d1\u05d7\u05e8 \u05d0\u05d6\u05d5\u05e8",
  car_local_price: "\u05de\u05d7\u05d9\u05e8 \u05de\u05e7\u05d5\u05de\u05d9",
  car_should_buy: "\u05db\u05d3\u05d0\u05d9 \u05dc\u05e7\u05e0\u05d5\u05ea \u05d1",
  car_estimated_price: "\u05de\u05d7\u05d9\u05e8 \u05de\u05e9\u05d5\u05e2\u05e8 \u05d1",
  car_ai_analysis: "\u05e0\u05d9\u05ea\u05d5\u05d7 AI",
  car_latest_news: "\u05d7\u05d3\u05e9\u05d5\u05ea \u05d0\u05d7\u05e8\u05d5\u05e0\u05d5\u05ea",
  car_match: "\u05d4\u05ea\u05d0\u05de\u05d4",
  car_price_tbd: "\u05de\u05d7\u05d9\u05e8 \u05d9\u05e4\u05d5\u05e8\u05e1\u05dd",

  region_global: "\u05e2\u05d5\u05dc\u05de\u05d9 / \u05d0\u05e8\u05d4\"\u05d1",
  region_israel: "\u05d9\u05e9\u05e8\u05d0\u05dc",
  region_russia: "\u05e8\u05d5\u05e1\u05d9\u05d4",
  region_arabic: "\u05d4\u05e2\u05d5\u05dc\u05dd \u05d4\u05e2\u05e8\u05d1\u05d9",
  region_all: "\u05db\u05dc \u05d4\u05d0\u05d6\u05d5\u05e8\u05d9\u05dd",

  compare_title: "\u05d4\u05e9\u05d5\u05d5\u05d0\u05ea \u05e8\u05db\u05d1\u05d9\u05dd",
  compare_select_cars: "\u05d1\u05d7\u05e8 \u05e9\u05e0\u05d9 \u05e8\u05db\u05d1\u05d9\u05dd \u05dc\u05d4\u05e9\u05d5\u05d5\u05d0\u05d4",
  compare_car_1: "\u05e8\u05db\u05d1 1",
  compare_car_2: "\u05e8\u05db\u05d1 2",
  compare_go: "\u05d4\u05e9\u05d5\u05d5\u05d4",
  compare_verdict: "\u05d7\u05d5\u05d5\u05ea \u05d3\u05e2\u05ea AI",

  videos_title: "\u05db\u05dc \u05e1\u05e8\u05d8\u05d5\u05e0\u05d9 \u05d4\u05e8\u05db\u05d1",
  videos_description: "\u05d1\u05d9\u05e7\u05d5\u05e8\u05d5\u05ea, \u05d4\u05e9\u05d5\u05d5\u05d0\u05d5\u05ea \u05d5\u05d7\u05d3\u05e9\u05d5\u05ea \u05e8\u05db\u05d1 \u05de\u05d9\u05d5\u05d8\u05d9\u05d5\u05d1 \u05d5\u05e2\u05d5\u05d3",

  common_loading: "\u05d8\u05d5\u05e2\u05df...",
  common_error: "\u05de\u05e9\u05d4\u05d5 \u05d4\u05e9\u05ea\u05d1\u05e9",
  common_retry: "\u05e0\u05e1\u05d4 \u05e9\u05d5\u05d1",
  common_back: "\u05d7\u05d6\u05e8\u05d4",
  common_close: "\u05e1\u05d2\u05d5\u05e8",
  common_share: "\u05e9\u05ea\u05e3",
  common_save: "\u05e9\u05de\u05d5\u05e8",
  common_view_all: "\u05e6\u05e4\u05d4 \u05d1\u05d4\u05db\u05dc",
  common_from: "\u05de-",
  common_year: "\u05e9\u05e0\u05d4",

  footer_questions: "\u05e9\u05d0\u05dc\u05d5\u05ea? \u05e6\u05d5\u05e8 \u05e7\u05e9\u05e8.",
  footer_faq: "\u05e9\u05d0\u05dc\u05d5\u05ea \u05e0\u05e4\u05d5\u05e6\u05d5\u05ea",
  footer_help: "\u05de\u05e8\u05db\u05d6 \u05e2\u05d6\u05e8\u05d4",
  footer_account: "\u05d7\u05e9\u05d1\u05d5\u05df",
  footer_media: "\u05de\u05e8\u05db\u05d6 \u05de\u05d3\u05d9\u05d4",
  footer_investors: "\u05e7\u05e9\u05e8\u05d9 \u05de\u05e9\u05e7\u05d9\u05e2\u05d9\u05dd",
  footer_jobs: "\u05d3\u05e8\u05d5\u05e9\u05d9\u05dd",
  footer_ways_to_watch: "\u05d3\u05e8\u05db\u05d9\u05dd \u05dc\u05e6\u05e4\u05d5\u05ea",
  footer_terms: "\u05ea\u05e0\u05d0\u05d9 \u05e9\u05d9\u05de\u05d5\u05e9",
  footer_privacy: "\u05e4\u05e8\u05d8\u05d9\u05d5\u05ea",
  footer_cookies: "\u05d4\u05e2\u05d3\u05e4\u05d5\u05ea \u05e2\u05d5\u05d2\u05d9\u05d5\u05ea",
  footer_corporate: "\u05de\u05d9\u05d3\u05e2 \u05ea\u05d0\u05d2\u05d9\u05d3\u05d9",

  sign_in_title: "\u05d4\u05ea\u05d7\u05d1\u05e8\u05d5\u05ea",
  sign_in_email: "\u05db\u05ea\u05d5\u05d1\u05ea \u05d0\u05d9\u05de\u05d9\u05d9\u05dc",
  sign_in_name: "\u05e9\u05dd \u05ea\u05e6\u05d5\u05d2\u05d4",
  sign_in_next: "\u05d4\u05d1\u05d0",
  sign_in_new: "\u05d7\u05d3\u05e9 \u05d1-AutoFlix?",
  sign_in_signup: "\u05d4\u05d9\u05e8\u05e9\u05dd \u05e2\u05db\u05e9\u05d9\u05d5",

  filter_make: "\u05d9\u05e6\u05e8\u05df",
  filter_model: "\u05d3\u05d2\u05dd",
  filter_year: "\u05e9\u05e0\u05d4",
  filter_type: "\u05e1\u05d5\u05d2",
  filter_all_makes: "\u05db\u05dc \u05d4\u05d9\u05e6\u05e8\u05e0\u05d9\u05dd",
  filter_all_models: "\u05db\u05dc \u05d4\u05d3\u05d2\u05de\u05d9\u05dd",
  filter_search: "\u05d7\u05e4\u05e9",
  filter_clear: "\u05e0\u05e7\u05d4",
  filter_results: "\u05ea\u05d5\u05e6\u05d0\u05d5\u05ea",
};

const ru: TranslationKeys = {
  nav_home: "\u0413\u043b\u0430\u0432\u043d\u0430\u044f",
  nav_cars: "\u0410\u0432\u0442\u043e\u043c\u043e\u0431\u0438\u043b\u0438",
  nav_news: "\u041d\u043e\u0432\u043e\u0441\u0442\u0438",
  nav_compare: "\u0421\u0440\u0430\u0432\u043d\u0435\u043d\u0438\u0435",
  nav_copilot: "AI \u041f\u043e\u043c\u043e\u0449\u043d\u0438\u043a",
  nav_my_list: "\u041c\u043e\u0439 \u0441\u043f\u0438\u0441\u043e\u043a",
  nav_videos: "\u0412\u0438\u0434\u0435\u043e",
  nav_sign_in: "\u0412\u043e\u0439\u0442\u0438",
  nav_sign_out: "\u0412\u044b\u0439\u0442\u0438 \u0438\u0437 AutoFlix",
  nav_browse: "\u041e\u0431\u0437\u043e\u0440",
  nav_find_car: "\u041d\u0430\u0439\u0442\u0438 \u0430\u0432\u0442\u043e",

  search_placeholder: "\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u044f, \u0430\u0432\u0442\u043e, \u043a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u0438",
  search_cars_placeholder: "\u041f\u043e\u0438\u0441\u043a \u0430\u0432\u0442\u043e 2026 \u2014 \u043c\u0430\u0440\u043a\u0430 \u0438\u043b\u0438 \u043c\u043e\u0434\u0435\u043b\u044c...",
  search_no_results: "\u041d\u0438\u0447\u0435\u0433\u043e \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u043e",
  searching: "\u041f\u043e\u0438\u0441\u043a...",

  home_popular: "\u041f\u043e\u043f\u0443\u043b\u044f\u0440\u043d\u043e\u0435 \u043d\u0430 AutoFlix",
  home_trending: "\u0421\u0435\u0439\u0447\u0430\u0441 \u0432 \u0442\u0440\u0435\u043d\u0434\u0435",
  home_tesla_fleet: "\u0424\u043b\u043e\u0442 Tesla",
  home_expert_reviews: "\u042d\u043a\u0441\u043f\u0435\u0440\u0442\u043d\u044b\u0435 \u043e\u0431\u0437\u043e\u0440\u044b",
  home_byd_collection: "\u041a\u043e\u043b\u043b\u0435\u043a\u0446\u0438\u044f BYD",
  home_comparisons: "\u0421\u0440\u0430\u0432\u043d\u0435\u043d\u0438\u044f \u043b\u043e\u0431 \u0432 \u043b\u043e\u0431",
  home_premium: "\u041f\u0440\u0435\u043c\u0438\u0443\u043c \u0438 \u043b\u044e\u043a\u0441",
  home_electric_revolution: "\u042d\u043b\u0435\u043a\u0442\u0440\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u0440\u0435\u0432\u043e\u043b\u044e\u0446\u0438\u044f",
  home_browse_2026: "\u0412\u0441\u0435 \u0430\u0432\u0442\u043e\u043c\u043e\u0431\u0438\u043b\u0438 2026",
  home_browse_2026_desc: "\u041f\u043e\u043b\u043d\u044b\u0435 \u0445\u0430\u0440\u0430\u043a\u0442\u0435\u0440\u0438\u0441\u0442\u0438\u043a\u0438, \u0432\u0441\u0435 \u043a\u043e\u043c\u043f\u043b\u0435\u043a\u0442\u0430\u0446\u0438\u0438, \u0446\u0435\u043d\u044b \u0434\u043b\u044f \u0421\u0428\u0410, \u0418\u0437\u0440\u0430\u0438\u043b\u044f, \u0420\u043e\u0441\u0441\u0438\u0438 \u0438 \u041e\u0410\u042d",
  home_find_your_car: "\u041d\u0430\u0439\u0434\u0438 \u0441\u0432\u043e\u0439 \u0430\u0432\u0442\u043e \u2192",
  home_all_videos: "\u0412\u0441\u0435 \u0432\u0438\u0434\u0435\u043e \u043e\u0431 \u0430\u0432\u0442\u043e",
  home_all_videos_desc: "\u041e\u0431\u0437\u043e\u0440\u044b, \u0441\u0440\u0430\u0432\u043d\u0435\u043d\u0438\u044f \u0438 \u043d\u043e\u0432\u043e\u0441\u0442\u0438 \u0441 YouTube \u0438 \u0434\u0440\u0443\u0433\u0438\u0445 \u0438\u0441\u0442\u043e\u0447\u043d\u0438\u043a\u043e\u0432",
  home_watch_now: "\u0421\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u2192",
  home_latest_news: "\u041f\u043e\u0441\u043b\u0435\u0434\u043d\u0438\u0435 \u0430\u0432\u0442\u043e\u043d\u043e\u0432\u043e\u0441\u0442\u0438",
  home_see_all: "\u0421\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u0432\u0441\u0435 \u2192",
  home_continue_watching: "\u041f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u044c \u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440",

  cars_title: "\u041d\u0430\u0439\u0434\u0438 \u0441\u0432\u043e\u0439 \u0430\u0432\u0442\u043e\u043c\u043e\u0431\u0438\u043b\u044c",
  cars_description: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u0438\u0442\u0435 \u0432\u0441\u0435 \u0430\u0432\u0442\u043e\u043c\u043e\u0431\u0438\u043b\u0438 2026 \u0433\u043e\u0434\u0430. \u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043c\u0430\u0440\u043a\u0443 \u0438 \u043c\u043e\u0434\u0435\u043b\u044c \u0434\u043b\u044f \u043f\u043e\u043b\u043d\u044b\u0445 \u0445\u0430\u0440\u0430\u043a\u0442\u0435\u0440\u0438\u0441\u0442\u0438\u043a, \u0432\u0441\u0435\u0445 \u043a\u043e\u043c\u043f\u043b\u0435\u043a\u0442\u0430\u0446\u0438\u0439, \u0440\u0435\u0433\u0438\u043e\u043d\u0430\u043b\u044c\u043d\u044b\u0445 \u0446\u0435\u043d \u0438 \u0440\u0435\u0439\u0442\u0438\u043d\u0433\u043e\u0432 EPA.",
  cars_vehicle_specs: "\u0425\u0430\u0440\u0430\u043a\u0442\u0435\u0440\u0438\u0441\u0442\u0438\u043a\u0438",
  cars_engines: "\u0414\u0432\u0438\u0433\u0430\u0442\u0435\u043b\u0438",
  cars_epa_ratings: "\u0420\u0435\u0439\u0442\u0438\u043d\u0433\u0438 EPA",
  cars_safety_ratings: "\u0411\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u043e\u0441\u0442\u044c",
  cars_browse_full_db: "\u041f\u043e\u043b\u043d\u0430\u044f \u0431\u0430\u0437\u0430 \u0434\u0430\u043d\u043d\u044b\u0445 \u2192",
  cars_popular_2026: "\u041f\u043e\u043f\u0443\u043b\u044f\u0440\u043d\u044b\u0435 \u043c\u043e\u0434\u0435\u043b\u0438 2026",

  car_full_specs: "\u041f\u043e\u043b\u043d\u044b\u0435 \u0445\u0430\u0440\u0430\u043a\u0442\u0435\u0440\u0438\u0441\u0442\u0438\u043a\u0438",
  car_overview: "\u041e\u0431\u0437\u043e\u0440",
  car_trims: "\u041a\u043e\u043c\u043f\u043b\u0435\u043a\u0442\u0430\u0446\u0438\u0438",
  car_compare: "\u0421\u0440\u0430\u0432\u043d\u0438\u0442\u044c",
  car_price: "\u0426\u0435\u043d\u0430",
  car_range: "\u0417\u0430\u043f\u0430\u0441 \u0445\u043e\u0434\u0430",
  car_battery: "\u0411\u0430\u0442\u0430\u0440\u0435\u044f",
  car_type: "\u0422\u0438\u043f",
  car_horsepower: "\u041c\u043e\u0449\u043d\u043e\u0441\u0442\u044c",
  car_acceleration: "0\u2013100 \u043a\u043c/\u0447",
  car_top_speed: "\u041c\u0430\u043a\u0441. \u0441\u043a\u043e\u0440\u043e\u0441\u0442\u044c",
  car_drivetrain: "\u041f\u0440\u0438\u0432\u043e\u0434",
  car_fuel_economy: "\u0420\u0430\u0441\u0445\u043e\u0434 \u0442\u043e\u043f\u043b\u0438\u0432\u0430",
  car_dimensions: "\u0413\u0430\u0431\u0430\u0440\u0438\u0442\u044b",
  car_weight: "\u0412\u0435\u0441",
  car_cargo: "\u0411\u0430\u0433\u0430\u0436\u043d\u0438\u043a",
  car_seats: "\u041c\u0435\u0441\u0442\u0430",
  car_warranty: "\u0413\u0430\u0440\u0430\u043d\u0442\u0438\u044f",
  car_compare_with: "\u0421\u0440\u0430\u0432\u043d\u0438\u0442\u044c \u0441 \u0434\u0440\u0443\u0433\u0438\u043c \u0430\u0432\u0442\u043e",
  car_select_region: "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0440\u0435\u0433\u0438\u043e\u043d",
  car_local_price: "\u041c\u0435\u0441\u0442\u043d\u0430\u044f \u0446\u0435\u043d\u0430",
  car_should_buy: "\u0421\u0442\u043e\u0438\u0442 \u043b\u0438 \u043f\u043e\u043a\u0443\u043f\u0430\u0442\u044c \u0432",
  car_estimated_price: "\u041e\u0440\u0438\u0435\u043d\u0442\u0438\u0440\u043e\u0432\u043e\u0447\u043d\u0430\u044f \u0446\u0435\u043d\u0430 \u0432",
  car_ai_analysis: "AI \u0410\u043d\u0430\u043b\u0438\u0437",
  car_latest_news: "\u041f\u043e\u0441\u043b\u0435\u0434\u043d\u0438\u0435 \u043d\u043e\u0432\u043e\u0441\u0442\u0438",
  car_match: "\u0421\u043e\u0432\u043f\u0430\u0434\u0435\u043d\u0438\u0435",
  car_price_tbd: "\u0426\u0435\u043d\u0430 \u0443\u0442\u043e\u0447\u043d\u044f\u0435\u0442\u0441\u044f",

  region_global: "\u0413\u043b\u043e\u0431\u0430\u043b\u044c\u043d\u044b\u0439 / \u0421\u0428\u0410",
  region_israel: "\u0418\u0437\u0440\u0430\u0438\u043b\u044c",
  region_russia: "\u0420\u043e\u0441\u0441\u0438\u044f",
  region_arabic: "\u0410\u0440\u0430\u0431\u0441\u043a\u0438\u0439 \u043c\u0438\u0440",
  region_all: "\u0412\u0441\u0435 \u0440\u0435\u0433\u0438\u043e\u043d\u044b",

  compare_title: "\u0421\u0440\u0430\u0432\u043d\u0435\u043d\u0438\u0435 \u0430\u0432\u0442\u043e\u043c\u043e\u0431\u0438\u043b\u0435\u0439",
  compare_select_cars: "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u0432\u0430 \u0430\u0432\u0442\u043e\u043c\u043e\u0431\u0438\u043b\u044f \u0434\u043b\u044f \u0441\u0440\u0430\u0432\u043d\u0435\u043d\u0438\u044f",
  compare_car_1: "\u0410\u0432\u0442\u043e 1",
  compare_car_2: "\u0410\u0432\u0442\u043e 2",
  compare_go: "\u0421\u0440\u0430\u0432\u043d\u0438\u0442\u044c",
  compare_verdict: "AI \u0412\u0435\u0440\u0434\u0438\u043a\u0442",

  videos_title: "\u0412\u0441\u0435 \u0432\u0438\u0434\u0435\u043e \u043e\u0431 \u0430\u0432\u0442\u043e",
  videos_description: "\u041e\u0431\u0437\u043e\u0440\u044b, \u0441\u0440\u0430\u0432\u043d\u0435\u043d\u0438\u044f \u0438 \u043d\u043e\u0432\u043e\u0441\u0442\u0438 \u0441 YouTube \u0438 \u0434\u0440\u0443\u0433\u0438\u0445 \u0438\u0441\u0442\u043e\u0447\u043d\u0438\u043a\u043e\u0432",

  common_loading: "\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430...",
  common_error: "\u0427\u0442\u043e-\u0442\u043e \u043f\u043e\u0448\u043b\u043e \u043d\u0435 \u0442\u0430\u043a",
  common_retry: "\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c",
  common_back: "\u041d\u0430\u0437\u0430\u0434",
  common_close: "\u0417\u0430\u043a\u0440\u044b\u0442\u044c",
  common_share: "\u041f\u043e\u0434\u0435\u043b\u0438\u0442\u044c\u0441\u044f",
  common_save: "\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c",
  common_view_all: "\u0421\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u0432\u0441\u0435",
  common_from: "\u041e\u0442",
  common_year: "\u0413\u043e\u0434",

  footer_questions: "\u0412\u043e\u043f\u0440\u043e\u0441\u044b? \u0421\u0432\u044f\u0436\u0438\u0442\u0435\u0441\u044c \u0441 \u043d\u0430\u043c\u0438.",
  footer_faq: "\u0427\u0430\u0441\u0442\u044b\u0435 \u0432\u043e\u043f\u0440\u043e\u0441\u044b",
  footer_help: "\u0426\u0435\u043d\u0442\u0440 \u043f\u043e\u043c\u043e\u0449\u0438",
  footer_account: "\u0410\u043a\u043a\u0430\u0443\u043d\u0442",
  footer_media: "\u041c\u0435\u0434\u0438\u0430-\u0446\u0435\u043d\u0442\u0440",
  footer_investors: "\u0418\u043d\u0432\u0435\u0441\u0442\u043e\u0440\u0430\u043c",
  footer_jobs: "\u0412\u0430\u043a\u0430\u043d\u0441\u0438\u0438",
  footer_ways_to_watch: "\u0421\u043f\u043e\u0441\u043e\u0431\u044b \u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u0430",
  footer_terms: "\u0423\u0441\u043b\u043e\u0432\u0438\u044f \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u044f",
  footer_privacy: "\u041a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u044c",
  footer_cookies: "\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438 \u043a\u0443\u043a\u0438",
  footer_corporate: "\u041a\u043e\u0440\u043f\u043e\u0440\u0430\u0442\u0438\u0432\u043d\u0430\u044f \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f",

  sign_in_title: "\u0412\u043e\u0439\u0442\u0438",
  sign_in_email: "\u042d\u043b\u0435\u043a\u0442\u0440\u043e\u043d\u043d\u0430\u044f \u043f\u043e\u0447\u0442\u0430",
  sign_in_name: "\u0412\u0430\u0448\u0435 \u0438\u043c\u044f",
  sign_in_next: "\u0414\u0430\u043b\u0435\u0435",
  sign_in_new: "\u041d\u043e\u0432\u044b\u0439 \u0432 AutoFlix?",
  sign_in_signup: "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043e\u0432\u0430\u0442\u044c\u0441\u044f",

  filter_make: "\u041c\u0430\u0440\u043a\u0430",
  filter_model: "\u041c\u043e\u0434\u0435\u043b\u044c",
  filter_year: "\u0413\u043e\u0434",
  filter_type: "\u0422\u0438\u043f",
  filter_all_makes: "\u0412\u0441\u0435 \u043c\u0430\u0440\u043a\u0438",
  filter_all_models: "\u0412\u0441\u0435 \u043c\u043e\u0434\u0435\u043b\u0438",
  filter_search: "\u041f\u043e\u0438\u0441\u043a",
  filter_clear: "\u041e\u0447\u0438\u0441\u0442\u0438\u0442\u044c",
  filter_results: "\u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u043e\u0432",
};

const ar: TranslationKeys = {
  nav_home: "\u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629",
  nav_cars: "\u0633\u064a\u0627\u0631\u0627\u062a",
  nav_news: "\u0623\u062e\u0628\u0627\u0631",
  nav_compare: "\u0645\u0642\u0627\u0631\u0646\u0629",
  nav_copilot: "\u0645\u0633\u0627\u0639\u062f AI",
  nav_my_list: "\u0642\u0627\u0626\u0645\u062a\u064a",
  nav_videos: "\u0641\u064a\u062f\u064a\u0648",
  nav_sign_in: "\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644",
  nav_sign_out: "\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062e\u0631\u0648\u062c \u0645\u0646 AutoFlix",
  nav_browse: "\u062a\u0635\u0641\u062d",
  nav_find_car: "\u0627\u0628\u062d\u062b \u0639\u0646 \u0633\u064a\u0627\u0631\u0629",

  search_placeholder: "\u0639\u0646\u0627\u0648\u064a\u0646\u060c \u0633\u064a\u0627\u0631\u0627\u062a\u060c \u0641\u0626\u0627\u062a",
  search_cars_placeholder: "\u0628\u062d\u062b \u0633\u064a\u0627\u0631\u0627\u062a 2026 \u2014 \u0627\u0643\u062a\u0628 \u0627\u0644\u0645\u0627\u0631\u043a\u0629 \u0623\u0648 \u0627\u0644\u0645\u0648\u062f\u064a\u0644...",
  search_no_results: "\u0644\u0627 \u062a\u0648\u062c\u062f \u0646\u062a\u0627\u0626\u062c",
  searching: "\u062c\u0627\u0631\u064a \u0627\u0644\u0628\u062d\u062b...",

  home_popular: "\u0627\u0644\u0623\u0643\u062b\u0631 \u0634\u0639\u0628\u064a\u0629 \u0639\u0644\u0649 AutoFlix",
  home_trending: "\u0627\u0644\u0631\u0627\u0626\u062c \u0627\u0644\u0622\u0646",
  home_tesla_fleet: "\u0623\u0633\u0637\u0648\u0644 \u062a\u0633\u0644\u0627",
  home_expert_reviews: "\u0645\u0631\u0627\u062c\u0639\u0627\u062a \u0627\u0644\u062e\u0628\u0631\u0627\u0621",
  home_byd_collection: "\u0645\u062c\u0645\u0648\u0639\u0629 BYD",
  home_comparisons: "\u0645\u0642\u0627\u0631\u0646\u0627\u062a \u0645\u0628\u0627\u0634\u0631\u0629",
  home_premium: "\u0641\u0627\u062e\u0631\u0629 \u0648\u0641\u062e\u0645\u0629",
  home_electric_revolution: "\u0627\u0644\u062b\u0648\u0631\u0629 \u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0626\u064a\u0629",
  home_browse_2026: "\u062a\u0635\u0641\u062d \u062c\u0645\u064a\u0639 \u0633\u064a\u0627\u0631\u0627\u062a 2026",
  home_browse_2026_desc: "\u0627\u0644\u0645\u0648\u0627\u0635\u0641\u0627\u062a \u0627\u0644\u0643\u0627\u0645\u0644\u0629\u060c \u062c\u0645\u064a\u0639 \u0627\u0644\u0641\u0626\u0627\u062a\u060c \u0623\u0633\u0639\u0627\u0631 \u0625\u0642\u0644\u064a\u0645\u064a\u0629 \u0644\u0644\u0648\u0644\u0627\u064a\u0627\u062a \u0627\u0644\u0645\u062a\u062d\u062f\u0629 \u0648\u0625\u0633\u0631\u0627\u0626\u064a\u0644 \u0648\u0631\u0648\u0633\u064a\u0627 \u0648\u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062a",
  home_find_your_car: "\u0627\u0628\u062d\u062b \u0639\u0646 \u0633\u064a\u0627\u0631\u062a\u0643 \u2190",
  home_all_videos: "\u062c\u0645\u064a\u0639 \u0641\u064a\u062f\u064a\u0648\u0647\u0627\u062a \u0627\u0644\u0633\u064a\u0627\u0631\u0627\u062a",
  home_all_videos_desc: "\u0623\u062d\u062f\u062b \u0627\u0644\u0645\u0631\u0627\u062c\u0639\u0627\u062a \u0648\u0627\u0644\u0645\u0642\u0627\u0631\u0646\u0627\u062a \u0648\u0627\u0644\u0623\u062e\u0628\u0627\u0631 \u0645\u0646 \u064a\u0648\u062a\u064a\u0648\u0628 \u0648\u063a\u064a\u0631\u0647\u0627",
  home_watch_now: "\u0634\u0627\u0647\u062f \u0627\u0644\u0622\u0646 \u2190",
  home_latest_news: "\u0622\u062e\u0631 \u0623\u062e\u0628\u0627\u0631 \u0627\u0644\u0633\u064a\u0627\u0631\u0627\u062a",
  home_see_all: "\u0639\u0631\u0636 \u0627\u0644\u0643\u0644 \u2190",
  home_continue_watching: "\u0645\u062a\u0627\u0628\u0639\u0629 \u0627\u0644\u0645\u0634\u0627\u0647\u062f\u0629",

  cars_title: "\u0627\u0628\u062d\u062b \u0639\u0646 \u0633\u064a\u0627\u0631\u062a\u0643",
  cars_description: "\u062a\u0635\u0641\u062d \u062c\u0645\u064a\u0639 \u0633\u064a\u0627\u0631\u0627\u062a 2026. \u0627\u062e\u062a\u0631 \u0627\u0644\u0645\u0627\u0631\u043a\u0629 \u0648\u0627\u0644\u0645\u0648\u062f\u064a\u0644 \u0644\u0631\u0624\u064a\u0629 \u0627\u0644\u0645\u0648\u0627\u0635\u0641\u0627\u062a \u0627\u0644\u0643\u0627\u0645\u0644\u0629 \u0648\u062c\u0645\u064a\u0639 \u0627\u0644\u0641\u0626\u0627\u062a \u0648\u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0625\u0642\u0644\u064a\u0645\u064a\u0629 \u0648\u062a\u0642\u064a\u064a\u0645\u0627\u062a EPA.",
  cars_vehicle_specs: "\u0645\u0648\u0627\u0635\u0641\u0627\u062a \u0627\u0644\u0633\u064a\u0627\u0631\u0629",
  cars_engines: "\u0627\u0644\u0645\u062d\u0631\u0643\u0627\u062a",
  cars_epa_ratings: "\u062a\u0642\u064a\u064a\u0645\u0627\u062a EPA",
  cars_safety_ratings: "\u062a\u0642\u064a\u064a\u0645\u0627\u062a \u0627\u0644\u0633\u0644\u0627\u0645\u0629",
  cars_browse_full_db: "\u062a\u0635\u0641\u062d \u0642\u0627\u0639\u062f\u0629 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0643\u0627\u0645\u0644\u0629 \u2190",
  cars_popular_2026: "\u0645\u0648\u062f\u064a\u0644\u0627\u062a 2026 \u0627\u0644\u0634\u0627\u0626\u0639\u0629",

  car_full_specs: "\u0627\u0644\u0645\u0648\u0627\u0635\u0641\u0627\u062a \u0627\u0644\u0643\u0627\u0645\u0644\u0629",
  car_overview: "\u0646\u0638\u0631\u0629 \u0639\u0627\u0645\u0629",
  car_trims: "\u0627\u0644\u0641\u0626\u0627\u062a \u0648\u0627\u0644\u0645\u0648\u0627\u0635\u0641\u0627\u062a",
  car_compare: "\u0645\u0642\u0627\u0631\u0646\u0629",
  car_price: "\u0627\u0644\u0633\u0639\u0631",
  car_range: "\u0627\u0644\u0645\u062f\u0649",
  car_battery: "\u0627\u0644\u0628\u0637\u0627\u0631\u064a\u0629",
  car_type: "\u0627\u0644\u0646\u0648\u0639",
  car_horsepower: "\u0627\u0644\u0642\u0648\u0629",
  car_acceleration: "0\u2013100 \u0643\u0645/\u0633",
  car_top_speed: "\u0627\u0644\u0633\u0631\u0639\u0629 \u0627\u0644\u0642\u0635\u0648\u0649",
  car_drivetrain: "\u0646\u0638\u0627\u0645 \u0627\u0644\u062f\u0641\u0639",
  car_fuel_economy: "\u0627\u0633\u062a\u0647\u0644\u0627\u043a \u0627\u0644\u0648\u0642\u0648\u062f",
  car_dimensions: "\u0627\u0644\u0623\u0628\u0639\u0627\u062f",
  car_weight: "\u0627\u0644\u0648\u0632\u0646",
  car_cargo: "\u0627\u0644\u062d\u0645\u0648\u0644\u0629",
  car_seats: "\u0627\u0644\u0645\u0642\u0627\u0639\u062f",
  car_warranty: "\u0627\u0644\u0636\u0645\u0627\u0646",
  car_compare_with: "\u0642\u0627\u0631\u0646 \u0645\u0639 \u0633\u064a\u0627\u0631\u0629 \u0623\u062e\u0631\u0649",
  car_select_region: "\u0627\u062e\u062a\u0631 \u0645\u0646\u0637\u0642\u062a\u0643",
  car_local_price: "\u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u0645\u062d\u0644\u064a",
  car_should_buy: "\u0647\u0644 \u064a\u062c\u0628 \u0627\u0644\u0634\u0631\u0627\u0621 \u0641\u064a",
  car_estimated_price: "\u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u062a\u0642\u0631\u064a\u0628\u064a \u0641\u064a",
  car_ai_analysis: "\u062a\u062d\u0644\u064a\u0644 AI",
  car_latest_news: "\u0622\u062e\u0631 \u0627\u0644\u0623\u062e\u0628\u0627\u0631",
  car_match: "\u062a\u0637\u0627\u0628\u0642",
  car_price_tbd: "\u0627\u0644\u0633\u0639\u0631 \u0644\u0627\u062d\u0642\u0627\u064b",

  region_global: "\u0639\u0627\u0644\u0645\u064a / \u0623\u0645\u0631\u064a\u0643\u0627",
  region_israel: "\u0625\u0633\u0631\u0627\u0626\u064a\u0644",
  region_russia: "\u0631\u0648\u0633\u064a\u0627",
  region_arabic: "\u0627\u0644\u0639\u0627\u0644\u0645 \u0627\u0644\u0639\u0631\u0628\u064a",
  region_all: "\u062c\u0645\u064a\u0639 \u0627\u0644\u0645\u0646\u0627\u0637\u0642",

  compare_title: "\u0645\u0642\u0627\u0631\u0646\u0629 \u0627\u0644\u0633\u064a\u0627\u0631\u0627\u062a",
  compare_select_cars: "\u0627\u062e\u062a\u0631 \u0633\u064a\u0627\u0631\u062a\u064a\u0646 \u0644\u0644\u0645\u0642\u0627\u0631\u0646\u0629",
  compare_car_1: "\u0633\u064a\u0627\u0631\u0629 1",
  compare_car_2: "\u0633\u064a\u0627\u0631\u0629 2",
  compare_go: "\u0642\u0627\u0631\u0646",
  compare_verdict: "\u062d\u0643\u0645 AI",

  videos_title: "\u062c\u0645\u064a\u0639 \u0641\u064a\u062f\u064a\u0648\u0647\u0627\u062a \u0627\u0644\u0633\u064a\u0627\u0631\u0627\u062a",
  videos_description: "\u0623\u062d\u062f\u062b \u0627\u0644\u0645\u0631\u0627\u062c\u0639\u0627\u062a \u0648\u0627\u0644\u0645\u0642\u0627\u0631\u0646\u0627\u062a \u0648\u0627\u0644\u0623\u062e\u0628\u0627\u0631 \u0645\u0646 \u064a\u0648\u062a\u064a\u0648\u0628 \u0648\u063a\u064a\u0631\u0647\u0627",

  common_loading: "\u062c\u0627\u0631\u064a \u0627\u0644\u062a\u062d\u0645\u064a\u0644...",
  common_error: "\u062d\u062f\u062b \u062e\u0637\u0623",
  common_retry: "\u0625\u0639\u0627\u062f\u0629 \u0627\u0644\u0645\u062d\u0627\u0648\u0644\u0629",
  common_back: "\u0631\u062c\u0648\u0639",
  common_close: "\u0625\u063a\u0644\u0627\u0642",
  common_share: "\u0645\u0634\u0627\u0631\u0643\u0629",
  common_save: "\u062d\u0641\u0638",
  common_view_all: "\u0639\u0631\u0636 \u0627\u0644\u0643\u0644",
  common_from: "\u0645\u0646",
  common_year: "\u0633\u0646\u0629",

  footer_questions: "\u0623\u0633\u0626\u0644\u0629\u061f \u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627.",
  footer_faq: "\u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0634\u0627\u0626\u0639\u0629",
  footer_help: "\u0645\u0631\u0643\u0632 \u0627\u0644\u0645\u0633\u0627\u0639\u062f\u0629",
  footer_account: "\u0627\u0644\u062d\u0633\u0627\u0628",
  footer_media: "\u0627\u0644\u0645\u0631\u0643\u0632 \u0627\u0644\u0625\u0639\u0644\u0627\u0645\u064a",
  footer_investors: "\u0639\u0644\u0627\u0642\u0627\u062a \u0627\u0644\u0645\u0633\u062a\u062b\u0645\u0631\u064a\u0646",
  footer_jobs: "\u0648\u0638\u0627\u0626\u0641",
  footer_ways_to_watch: "\u0637\u0631\u0642 \u0627\u0644\u0645\u0634\u0627\u0647\u062f\u0629",
  footer_terms: "\u0634\u0631\u0648\u0637 \u0627\u0644\u0627\u0633\u062a\u062e\u062f\u0627\u0645",
  footer_privacy: "\u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629",
  footer_cookies: "\u062a\u0641\u0636\u064a\u0644\u0627\u062a \u0627\u0644\u0643\u0648\u0643\u064a\u0632",
  footer_corporate: "\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0627\u0644\u0634\u0631\u0643\u0629",

  sign_in_title: "\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644",
  sign_in_email: "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a",
  sign_in_name: "\u0627\u0633\u0645 \u0627\u0644\u0639\u0631\u0636",
  sign_in_next: "\u0627\u0644\u062a\u0627\u0644\u064a",
  sign_in_new: "\u062c\u062f\u064a\u062f \u0639\u0644\u0649 AutoFlix\u061f",
  sign_in_signup: "\u0633\u062c\u0644 \u0627\u0644\u0622\u0646",

  filter_make: "\u0627\u0644\u0645\u0627\u0631\u043a\u0629",
  filter_model: "\u0627\u0644\u0645\u0648\u062f\u064a\u0644",
  filter_year: "\u0627\u0644\u0633\u0646\u0629",
  filter_type: "\u0627\u0644\u0646\u0648\u0639",
  filter_all_makes: "\u062c\u0645\u064a\u0639 \u0627\u0644\u0645\u0627\u0631\u0643\u0627\u062a",
  filter_all_models: "\u062c\u0645\u064a\u0639 \u0627\u0644\u0645\u0648\u062f\u064a\u0644\u0627\u062a",
  filter_search: "\u0628\u062d\u062b",
  filter_clear: "\u0645\u0633\u062d",
  filter_results: "\u0646\u062a\u0627\u0626\u062c",
};

export const translations: Record<Locale, TranslationKeys> = { en, he, ru, ar };

export type TranslationKey = keyof TranslationKeys;

export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale]?.[key] || translations.en[key] || key;
}
