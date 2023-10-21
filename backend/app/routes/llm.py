from claude_api import Client

def LLM(user_input, conversation_id="0"):
    print(conversation_id)
    cookie = "activitySessionId=5d1ca80a-900d-4697-9771-f6525045bf90; __ssid=9ff96d6399d7e3f0f71ed10ab05ffe5; sessionKey=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; intercom-device-id-lupk8zyo=601c1a24-655d-486c-a089-9f91a8e2ee0d; cf_clearance=HoMoNtOI_XIe5y7mAQo5aCqVHsR76KIkc76OAaJ4yRE-1697860518-0-1-c2f27b91.7fa84def.95f32471-0.2.1697860518; __cf_bm=iKfZy583.YvzAy6o5DmoUdfT9mSpx6Hde4IT.6.c1tQ-1697862062-0-ATYKfy++3sgUikW8hpOfFOMwf6k+EhXBpzY1KAvSYUgViNmuesPiWM7vu/zFtMv7kkUB4DkzdwmwW24B8oZ2Hiw=; intercom-session-lupk8zyo=bHczTmMxQWYvTVdLMUhGQnF2Ym1DRTk0YW11YVRZc3k3WUtVUjVqMGJKS0Q3UTdqd25mZjZKU1ZjOUdLbWFSeS0tVE5zZlcwcTdPK1dGQ096eVZNc3hXZz09--5342f6b59ebcb816c706e1962b615cc5bf4ce075"
    claude_api = Client(cookie)
    
    if conversation_id=="0":
        conversation_id = claude_api.create_new_chat()['uuid']
    
    response = claude_api.send_message(user_input, conversation_id)
    
    return response, conversation_id







