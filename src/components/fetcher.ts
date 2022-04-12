export const fetcher = (input: RequestInfo, init?: RequestInit | undefined) => fetch(input, init).then(res => res.json())

const delay = (ms:number) => new Promise<void>((resolve) => setTimeout(() => resolve(), ms));

export const retryFetch = (
  input: RequestInfo,
  retries = 5,
  retryDelay = 10000,
  fetchOptions?:RequestInit,
) => {
  return new Promise<Response>((resolve, reject) => {

    const wrapper = (n:number) => {
        console.log('fetching')
      fetch(input, fetchOptions)
        .then((res) => {
            console.log(res) 
            if(res.status === 200){
                return resolve(res)
            }else {
                throw res.status
            }
        })
        .catch(async (err) => {
          if (n > 0) {
            await delay(retryDelay);
            wrapper(--n);
          } else {
            reject(err);
          }
        });
    };

    wrapper(retries);
  });
};