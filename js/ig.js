import axios from "axios";
import { IK, IS } from "./config.js";
export const I = "https://api.insightgenie.ai/";

async function auth() {
  return {
    headers: {
      Authorization: `Bearer ${
        (await axios.post(`${I}auth/authenticate`, { key: IK, secret: IS }))
          .data.token
      }`,
    },
  };
}

export async function digiPrint() {
  return (
    await axios.post(
      `${ig}digital-footprint`,
      {
        fullName: "Who Wan Tan",
        gender: "male",
        dateOfBirth: "03 Nov 1986",
        email: "whowantan@gmail.com",
        phoneCode: "65",
        phoneNumber: "98899889",
      },
      await auth(),
    )
  ).data;
}

export async function getIframe() {
  return (
    await axios.post(
      `${I}face-scan/generate-video-token`,
      {
        clientId: "igai",
        age: 18,
        gender: "male",
        showResults: "display",
        isVoiceAnalysisOn: false,
        forceFrontCamera: true,
        // diabetesHypertensionParameters: {
        //   height: 168,
        //   weight: 63,
        //   smoker: false,
        //   hypertension: false,
        //   bpMedication: false,
        //   diabetic: 0,
        //   waistCircumference: 29,
        //   heartDisease: false,
        //   depression: false,
        //   totalCholesterol: 200,
        //   hdl: 50,
        //   parentalHypertension: 0,
        //   physicalActivity: true,
        //   healthyDiet: true,
        //   antiHypertensive: false,
        //   historyBloodGlucose: false,
        //   historyFamilyDiabetes: 0,
        // },
      },
      await auth(),
    )
  ).data.videoIframeUrl;
}
