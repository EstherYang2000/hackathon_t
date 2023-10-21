import json
with open(f'app/routes/data/hr_report.json') as f:
        data = json.load(f) 
week = str(37)
dept = 'DEPT1'
zone = 'AZ'
# for index in data:
#     print(data[index][week][dept][zone])
d = {'lateDeptCount' : data['lateDeptCount'][week][dept][zone], 'lateTable':data['lateTable'][week][dept][zone],'weeklyZoneLateCount':data['weeklyZoneLateCount'][week][dept][zone]}
print(type(d))
