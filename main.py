import pandas as pd
import geopy.distance
from fastapi import FastAPI, Request,HTTPException
from pydantic import BaseModel
from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import httpx
import json


load_dotenv()

app = FastAPI()
origins = ["*"]  # Allow all origins, you can adjust this based on your needs

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Load rules from the CSV file using pandas
rules = pd.read_csv('rules_simple.csv')
# Transaction Model
class MerchantLocation(BaseModel):
    longitude: float
    latitude: float
class Transaction(BaseModel):
    distance:int =None
    age: int
    gender:str
    category: str 
    amount: int
    population: int =None
    merchant : MerchantLocation
    def to_dict(self):
        return dict(self.__dict__)
# Input Normalization Methods
def get_time_period():
    current_time = datetime.now().time()
    if current_time.hour < 12:
        return "Forenoon"
    elif current_time.hour < 17:
        return "Afternoon"
    else:
        return "Evening"
def categorize_distance(distance):
    if distance < 39.51458312511411:
        return "nearby"
    elif distance < 56.4090045083898:
        return "moderate"
    else:
        return "far"
def categorize_population(population):
    if population > 5.640328239467187:
        return "Highly"
    elif 4.910818713222447 <= population <=  5.640328239467187:
        return "Moderately"
    else:
        return "Sparsely"
def categorize_amount(amount):
    if amount > 5.679355014609812:
        return "Highly"
    elif 3.702776454030607 <= amount <= 5.679355014609812:
        return "Moderately"
    else:
        return "Sparsely"
def categorize_age(age):
    if age >= 56:
        return "old"
    elif 40.0 <= age < 56:
        return "middle"
    else:
        return "young"

async def get_city_opendata(city, country):
    url = "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records"
    params = {
        "select": "population",
        "where": f'name="{city}" and country_code="{country}"',
        "limit": 20,
    }
    async with httpx.AsyncClient() as client:
        res = await client.get(url,params=params)
        if res.status_code == 200:
            dct = json.loads(res.content)
            out = dct['results'][0]['population']
            return out
        else:
            raise HTTPException(status_code=res.status_code, detail="Failed to fetch population")
       

async def normalizeInput(transaction:Transaction,location):
    noramlizedInput=transaction.to_dict()
    noramlizedInput['transaction']=get_time_period()
    noramlizedInput['age']=categorize_age(noramlizedInput['age'])
    noramlizedInput['amount']=categorize_amount(noramlizedInput['amount'])
    noramlizedInput['population']=categorize_population(await get_city_opendata(location['city'],location['country']))
    noramlizedInput['distance']=categorize_distance(geopy.distance.geodesic(tuple(location["loc"].split(',')), (noramlizedInput["merchant"].longitude, noramlizedInput["merchant"].latitude)).miles)
    return noramlizedInput
# Getting User Location 
async def get_client_ip(request: Request):
    return request.client.host

async def get_user_location(ip: str = Depends(get_client_ip)):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://ipinfo.io/{ip}/json")
        if response.status_code == 200:
            data = response.json()
            return data
        else:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch location")

# Fraud Detection End-Point
@app.route("/detect/", methods=["POST", "OPTIONS"])
async def detect(transaction: Transaction,location: dict = Depends(get_user_location)):
    transactionNormalized=await normalizeInput(transaction,location)
    for _, rule in rules.iterrows():
        if all(pd.isna(v) or transactionNormalized[k] == v for k, v in rule.items()):
            return {
                "fraud":True,
                "message": "🚨 Fraud Alert! 🚨 Whoa there, Sherlock! We just caught a sneaky attempt at mischief.🕵️‍♂️💼",
                "transaction":transactionNormalized
                }
    return {
                "fraud":False,
                "message": "🌟 Your transactions are as clean as a whistle.🎩💸",
                "transaction":transactionNormalized
                }

@app.get("/")
def read_root():
    return {"message": "🕵️‍♂️ Welcome to the Fraud Buster API! We're on a mission to sniff out tricksters and keep your transactions as clean as a freshly laundered detective's coat. Let's catch those sneaky digits! 💳🔍"}