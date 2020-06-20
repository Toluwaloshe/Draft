# Python program to read 
# json file 
import json
# JSON file final_GDP_data.geojson
f1 = open ('../data/final_workforce_data.geojson', "r")   
f2 = open ('../data/countries2.geojson', "r") 
#f1 = open ('../static/data/sample_data2.json', "r")  
#f2 = open ('../static/data/sample_data.json', "r") 
print ('reading file2')
data1 = json.loads(f1.read()) 
data2 = json.loads(f2.read()) 
print('merging json')
#print(data1)
#print (data2)
#Build country to gdp_growth dictionary using list for 2018
myList = list()
for i in data2['features']:
#    print (i['properties']['code'],i['properties']['gdp_growth'])
   # if i['properties']['year']==2018:
        myList.append([i['id'],i['geometry']])
#print(myList)
# dictionary for country code -> gdp_growth
my_dict=dict(myList)
#print(my_dict['AFG'])
# Closing file 
f2.close() 
myList = list()
# Iterating through the json 
# list 
# prepare new value list for features 
# Add gdp_growth key in properties list
for i in data1['features']:
    #if i['properties']['year']==2018:
    print(i['properties']['code'])
    i.update(geometry = my_dict[i['properties']['code']] if i['properties']['code'] in my_dict else '' )
    myList.append(i)
   # print(i)
#print (my_list)
my_json=data1
my_json['features']=myList
#print (my_json)
print('writing merged file')
with open("../data/merged_workforce_data_geo.json", "w") as outfile: 
    json.dump(my_json, outfile) 
#print (my_json)
#for i in my_json['features']:
#    print(i['geometry'])
# Closing file 
f1.close()