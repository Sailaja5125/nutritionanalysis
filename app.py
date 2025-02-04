# gemini api code snippet 
import google.generativeai as genai
genai.configure(api_key="Your own api key")
model = genai.GenerativeModel("gemini-1.5-flash")
response = model.generate_content("Recognize the food item in this image https://media.self.com/photos/5b43712e4d0c3c282a8878d1/16:9/w_4160,h_2340,c_limit/avocado.jpg and say only the food item ")
print(response.text)
