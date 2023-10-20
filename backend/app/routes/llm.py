from claude_api import Client

def LLM(user_input, conversation_id=None):
    cookie = "activitySessionId=7563c9dd-39fd-4398-94c3-6e271602c8ec; __cf_bm=ISEVbkRYp1o6eB_gp.y0CD_lxVM2ERLFZla4KofQNCw-1697733647-0-AeaMyFXRLrO9a6xne3SM59yANv1p/X6DGKO7sSqQq5KeLU9QnwhzWTARGYh2nYk5Tf9snOtzoCuU3LKVXw0V7zM=; cf_clearance=rIqDUtqCHSr9fFUYgQseCnkz_qsEegIHu.sK5Vg6fM4-1697733647-0-1-b86bdbb4.e90b039a.ef6a8454-0.2.1697733647; __ssid=0a1eb4bda52435a11d15a435fa77b58; sessionKey=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; intercom-device-id-lupk8zyo=4cbdc19d-2825-4ad9-8381-d38d2523d258; intercom-session-lupk8zyo=cnljWGpncjJxbFpNdXZPd1JWd083dU5OVFNyUzBLbnpGZTVZN2luWVV1ZTNqQ0thMUI5WVIzZ21RaElPZ2hVdi0tRzBnZTNJNGlsQ085U0RvQ0haK1dzQT09--af6840e23e1494ab34bdc1051d3f093fe3e63703"
    claude_api = Client(cookie)
    
    if conversation_id==None:
        conversation_id = claude_api.create_new_chat()['uuid']
    
    response = claude_api.send_message(user_input, conversation_id)
    
    return response, conversation_id
