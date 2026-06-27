from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import urllib.request
import json
from django.conf import settings
from django.conf.urls.static import static

def utxo_proxy(request, address):

    try:
        clean = address.replace('bitcoincash:', '')
        url = f'https://api.blockchair.com/bitcoin-cash/outputs?q=recipient({clean}),is_spent(false)&limit=50'
        req = urllib.request.Request(url, headers={'User-Agent': 'Provena/1.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())

        utxos = []
        for row in data.get('data', []):
            utxos.append({
                'tx_hash': row.get('transaction_hash'),
                'tx_pos':  row.get('index'),
                'value':   row.get('value'),
            })


        return JsonResponse({'utxos': utxos})
    except Exception as e:
        return JsonResponse({'error': str(e), 'utxos': []}, status=502)

@csrf_exempt
def watchtower_proxy(request, path):
    """
    Proxy requests to Watchtower API for development
    In production, frontend should use https://watchtower.cash/api directly
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are supported'}, status=405)
    try:
        url = f'https://watchtower.cash/api/{path}'
        data = json.loads(request.body)
        req = urllib.request.Request(
            url,
            data=json.dumps(data).encode('utf-8'),
            headers={
                'Content-Type': 'application/json',
                'User-Agent': 'Provena/1.0'
            },
            method='POST'
        )        

        with urllib.request.urlopen(req, timeout=30) as response:
            response_data = json.loads(response.read().decode())
            return JsonResponse(response_data, status=response.status)
            
    except urllib.error.HTTPError as e:
        error_body = e.read().decode() if e.fp else str(e)

        return JsonResponse({'error': f'Watchtower API error: {e.code}', 'details': error_body}, status=e.code)

    except urllib.error.URLError as e:

        return JsonResponse({'error': f'Connection error: {str(e)}'}, status=502)

    except Exception as e:

        return JsonResponse({'error': str(e)}, status=500)



urlpatterns = [

    path('admin/', admin.site.urls),

    path('api/publickeys/', include('publickeys.urls')),

    path('api/utxos/<str:address>/', utxo_proxy),

    path('api/watchtower/<path:path>', watchtower_proxy),
    
    path('api/records/', include('records.urls')),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)