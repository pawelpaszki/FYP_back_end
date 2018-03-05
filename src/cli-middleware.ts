import axios from 'axios';

const url: string = 'http://localhost:3000/api';

export const createContainer = (token: string, imageName: string) => {
  (async () => {
    try {
      const response = await axios.post(`${url}/containers/create`,  {
        imageName,
      }, {headers: {'x-access-token': token}});
      /* tslint:disable */ console.log(response.data.id); /* tslint:enable */
    } catch (error) {
      /* tslint:disable */ console.log('unable to create container'); /* tslint:enable */
    }
  })();
};

export const startContainer = (token: string, containerId: string) => {
  (async () => {
    try {
      const response = await axios.post(`${url}/containers/start`,  {
        containerId,
      }, {headers: {'x-access-token': token}});
      /* tslint:disable */ console.log('container started'); /* tslint:enable */
    } catch (error) {
      /* tslint:disable */ console.log('unable to start container'); /* tslint:enable */
    }
  })();
};

export const stopContainer = (token: string, containerId: string) => {
  (async () => {
    try {
      const response = await axios.post(`${url}/containers/stop`,  {
        containerId,
      }, {headers: {'x-access-token': token}});
      /* tslint:disable */ console.log('container stopped'); /* tslint:enable */
    } catch (error) {
      /* tslint:disable */ console.log('unable to stop container'); /* tslint:enable */
    }
  })();
};

export const removeContainer = (token: string, containerId: string) => {
  (async () => {
    try {
      const response = await axios.delete(`${url}/containers/${containerId}`,
        {headers: {'x-access-token': token}});
      /* tslint:disable */ console.log('container removed'); /* tslint:enable */
    } catch (error) {
      /* tslint:disable */ console.log('unable to remove container'); /* tslint:enable */
    }
  })();
};

export const extractContainer = (token: string, containerId: string, imageName: string) => {
  (async () => {
    try {
      const response = await axios.post(`${url}/containers/extract`,  {
        containerId,
        imageName,
      }, {headers: {'x-access-token': token}});
      /* tslint:disable */ console.log('container extracted');; /* tslint:enable */
    } catch (error) {
      /* tslint:disable */ console.log('unable to extract container'); /* tslint:enable */
    }
  })();
};

export const checkForVulnComps = (token: string, imageName: string, checkOnly: boolean) => {
  (async () => {
    try {
      const response = await axios.put(`${url}/imagefreshness`,  {
        checkOnly, imageName,
      }, {headers: {'x-access-token': token}});
      /* tslint:disable */ console.log(response.data.updates); /* tslint:enable */
    } catch (error) {
      /* tslint:disable */ console.log('unable to perform vulnerability check'); /* tslint:enable */
    }
  })();
};

export const performVulnerabilityCheck = (token: string, imageName: string) => {
  (async () => {
    try {
      const response = await axios.put(`${url}/imagefreshness`,  {
        imageName,
      }, {headers: {'x-access-token': token}});
      /* tslint:disable */ console.log({'updates': response.data}); /* tslint:enable */
    } catch (error) {
      /* tslint:disable */ console.log('unable to perform vulnerability check'); /* tslint:enable */
    }
  })();
};

export const pullImage = (token: string, imageName: string) => {
  (async () => {
    try {
      const response = await axios.post(`${url}/images/pull`,  {
        imageName,
      }, {headers: {'x-access-token': token}});
      /* tslint:disable */ console.log('image successfully pulled'); /* tslint:enable */
    } catch (error) {
      /* tslint:disable */ console.log('unable to pull image' + imageName); /* tslint:enable */
    }
  })();
};

export const removeImage = (token: string, imageId: string) => {
  (async () => {
    try {
      const response = await axios.delete(`${url}/images/${imageId}`,
        {headers: {'x-access-token': token}});
      /* tslint:disable */ console.log('Image removed successfully'); /* tslint:enable */
    } catch (error) {
      /* tslint:disable */ console.log('unable to remove image'); /* tslint:enable */
    }
  })();
};

export const runNpmTests = (token: string, imageName: string) => {
  (async () => {
    try {
      const response = await axios.post(`${url}/npm/tests`,  {
        imageName,
      }, {headers: {'x-access-token': token}});
      /* tslint:disable */ console.log(response.data); /* tslint:enable */
    } catch (error) {
      /* tslint:disable */ console.log('Unable to run npm tests',); /* tslint:enable */
    }
  })();
};

export const runNcuCheck = (token: string, imageName: string) => {
  (async () => {
    try {
      const response = await axios.post(`${url}/npm/checkUpdates`,  {
        imageName,
      }, {headers: {'x-access-token': token}});
      /* tslint:disable */ console.log(response.data); /* tslint:enable */
    } catch (error) {
      /* tslint:disable */ console.log('Unable to check for npm updates',); /* tslint:enable */
    }
  })();
};

export const updateNpmComponents = (token: string, imageName: string) => {
  (async () => {
    try {
      const response = await axios.post(`${url}/npm/update`,  {
        imageName,
      }, {headers: {'x-access-token': token}});
      /* tslint:disable */ console.log(response.data); /* tslint:enable */
    } catch (error) {
      /* tslint:disable */ console.log('Unable to update components',); /* tslint:enable */
    }
  })();
};

export const updateNpmComponent = (token: string, imageName: string, packageName: string) => {
  (async () => {
    try {
      const response = await axios.post(`${url}/npm/update`,  {
        imageName,
        packageName,
      }, {headers: {'x-access-token': token}});
      /* tslint:disable */ console.log(response.data); /* tslint:enable */
    } catch (error) {
      /* tslint:disable */ console.log('Unable to update components',); /* tslint:enable */
    }
  })();
};

export const updateAndReinstall = (token: string, imageName: string, packageName: string) => {
  (async () => {
    try {
      const response = await axios.post(`${url}/npm/update`,  {
        imageName,
        packageName,
        reinstall: true,
      }, {headers: {'x-access-token': token}});
      /* tslint:disable */ console.log(response.data); /* tslint:enable */
    } catch (error) {
      /* tslint:disable */ console.log('Unable to update components',); /* tslint:enable */
    }
  })();
};

export const removeSrcCode = (token: string, imageName: string) => {
  (async () => {
    try {
      const response = await axios.delete(`${url}/npm/src/${imageName}`,
         {headers: {'x-access-token': token}});
      /* tslint:disable */ console.log('Source code successfully removed'); /* tslint:enable */
    } catch (error) {
      /* tslint:disable */ console.log('Unable to remove source code',); /* tslint:enable */
    }
  })();
};

export const dockerLogin = (token: string, username: string, password: string) => {
  (async () => {
    try {
      const response = await axios.post(`${url}/misc/dockerLogin`,  {
        password,
        username,
      }, {headers: {'x-access-token': token}});
      /* tslint:disable */ console.log('Login Successful'); /* tslint:enable */
    } catch (error) {
      /* tslint:disable */ console.log('Incorrect login and/or password'); /* tslint:enable */
    }
  })();
};

export const buildImage = (token: string, imageName: string) => {
  (async () => {
    try {
      const response = await axios.post(`${url}/images/build`,  {
        imageName,
      }, {headers: {'x-access-token': token}});
      /* tslint:disable */ console.log('Image successfully built'); /* tslint:enable */
    } catch (error) {
      /* tslint:disable */ console.log('Unable to build image'); /* tslint:enable */
    }
  })();
};

export const pushImage = (token: string, imageName: string) => {
  (async () => {
    try {
      const response = await axios.post(`${url}/images/push`,  {
        imageName,
      }, {headers: {'x-access-token': token}});
      /* tslint:disable */ console.log('Image pushed to DockerHub'); /* tslint:enable */
    } catch (error) {
      /* tslint:disable */ console.log('Unable to push image'); /* tslint:enable */
    }
  })();
};

export const checkTag = (token: string, imageName: string) => {
  (async () => {
    try {
      const response = await axios.post(`${url}/images/checkTag`,  {
        imageName,
      }, {headers: {'x-access-token': token}});
      /* tslint:disable */ console.log(response.data); /* tslint:enable */
    } catch (error) {
      /* tslint:disable */ console.log('Unable to push image'); /* tslint:enable */
    }
  })();
};

export const login = (username: string, password: string) => {
  (async () => {
    try {
      const response = await axios.post(`${url}/login`,  {
        password,
        username,
      });
      /* tslint:disable */ console.log(response.data.token); /* tslint:enable */
    } catch (error) {
      /* tslint:disable */ console.log('Unable to login'); /* tslint:enable */
    }
  })();
};

export const register = (username: string, password: string) => {
  (async () => {
    try {
      const response = await axios.post(`${url}/register`,  {
        password,
        username,
      });
      /* tslint:disable */ console.log(response.data.token); /* tslint:enable */
    } catch (error) {
      /* tslint:disable */ console.log('Unable to register'); /* tslint:enable */
    }
  })();
};
