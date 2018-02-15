import axios from 'axios';

const url: string = 'http://localhost:3000/api';

export const createContainer = (name: string) => {
  (async () => {
    try {
      const response = await axios.post(`${url}/containers/create`,  {
        name,
      });
      /* tslint:disable */ console.log(response.data.id); /* tslint:enable */
    } catch (error) {
      /* tslint:disable */ console.log('unable to create container'); /* tslint:enable */
    }
  })();
};

export const startContainer = (containerId: string) => {
  (async () => {
    try {
      const response = await axios.post(`${url}/containers/start`,  {
        containerId,
      });
      /* tslint:disable */ console.log('container started'); /* tslint:enable */
    } catch (error) {
      /* tslint:disable */ console.log('unable to start container'); /* tslint:enable */
    }
  })();
};

export const extractContainer = (containerId: string, imageName: string) => {
  (async () => {
    try {
      const response = await axios.post(`${url}/containers/extract`,  {
        containerId,
        imageName,
      });
      /* tslint:disable */ console.log('container extracted');; /* tslint:enable */
    } catch (error) {
      /* tslint:disable */ console.log('unable to extract container'); /* tslint:enable */
    }
  })();
};

export const performVulnerabilityCheck = (name: string) => {
  (async () => {
    try {
      const response = await axios.put(`${url}/imagefreshness`,  {
        name,
      });
      /* tslint:disable */ console.log('vulnerability check completed for: ' + name); /* tslint:enable */
    } catch (error) {
      /* tslint:disable */ console.log('unable to perform vulnerability check'); /* tslint:enable */
    }
  })();
};

