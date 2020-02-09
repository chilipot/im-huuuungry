from concurrent import futures

import requests


def make_request(url, method='get', params=None, body=None, **kwargs):
    """
    Requests wrapper with error handling
    :param url: URL to make request
    :param method: HTTP method to use for request (default: GET)
    :param params: query params for request
    :param body: request body (optional)
    :return: request json result
    """
    result = None
    try:
        req_args = {"params": (params or {})}
        if body is not None:
            req_args["body"] = body
        resp = getattr(requests, method)(url, **req_args, **kwargs)
        resp.raise_for_status()
        result = resp.json()
    except requests.exceptions.HTTPError as e:
        print(e)  # Perform some kind of logging
    except Exception as err:
        print(err)  # Perform some kind of logging
    return result


def meters_to_miles(m):
    """
    Converts meters to miles because google loves meters
    :param m: dist in meters
    :return: dist in miles
    """
    METERS_PER_MILE = 0.000621371
    return m * METERS_PER_MILE


def dot_product(v1, v2):
    """ Dot product of two vectors v1 and v2 """
    return sum(x * y for x, y in zip(v1, v2))


def fix_photo_refs_rest_dict(r):
    return {(k if k != "_photo_refs" else "photo_refs"): v for k, v in r.items()}


def make_func(func, *args, **kwargs):
    return lambda: func(*args, **kwargs)


def concurrent_requests(request_funcs):
    with futures.ThreadPoolExecutor(max_workers=min(10, len(request_funcs))) as executor:
        reqs = [executor.submit(request_func) for request_func in request_funcs]

    return [res.result() for res in reqs]
