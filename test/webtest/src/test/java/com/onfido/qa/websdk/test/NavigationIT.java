package com.onfido.qa.websdk.test;

import com.onfido.qa.annotation.Browser;
import com.onfido.qa.websdk.UploadDocument;
import com.onfido.qa.websdk.page.ConfirmUpload;
import com.onfido.qa.websdk.page.DocumentUpload;
import com.onfido.qa.websdk.page.FaceVideo;
import com.onfido.qa.websdk.page.FaceVideoIntro;
import com.onfido.qa.websdk.page.IdDocumentSelector;
import com.onfido.qa.websdk.page.ImageQualityGuide;
import com.onfido.qa.websdk.page.PassportUploaderIntro;
import com.onfido.qa.websdk.page.SelfieIntro;
import com.onfido.qa.websdk.page.SelfieUpload;
import com.onfido.qa.websdk.page.Welcome;
import com.onfido.qa.websdk.sdk.FaceStep;
import org.testng.annotations.Test;

import static com.onfido.qa.websdk.DocumentType.PASSPORT;
import static com.onfido.qa.websdk.UploadDocument.FACE;
import static com.onfido.qa.websdk.UploadDocument.PASSPORT_JPG;
import static com.onfido.qa.websdk.sdk.FaceStep.Variant.VIDEO;

public class NavigationIT extends WebSdkIT{

    public NavigationIT() {
    }

    public NavigationIT(String language) {
        super(language);
    }

    @Test(description = "should navigate to the second-last step of the flow and then go back to the beginning")
    public void testNavigateToSecondLastStepAndThenBackToBeginning() {
        onfido().withSteps("welcome", "document", new FaceStep().withUseUploader(true), "complete")
                .init(Welcome.class)
                .continueToNextStep(IdDocumentSelector.class)
                .select(PASSPORT, DocumentUpload.class)
                .clickUploadButton(ImageQualityGuide.class)
                .upload(PASSPORT_JPG)
                .clickConfirmButton(SelfieUpload.class)
                .upload(FACE)
                .back(SelfieUpload.class)
                .back(ConfirmUpload.class)
                .back(ImageQualityGuide.class)
                .back(DocumentUpload.class)
                .back(IdDocumentSelector.class);

    }

    @Test(description = "should display the face video intro again on back button click when on the face video flow and I have a camera")
    @Browser(enableMicrophoneCameraAccess = true)
    public void testShouldDisplayTheFaceVideoIntroAgainOnBackButtonClickWhenOnTheFaceVideoFlowAndIHaveACamera() {
        onfido().withSteps("document", new FaceStep().withRequestedVariant(VIDEO))
                .beforeInit(this::provideVideoDevice)
                .init(IdDocumentSelector.class)
                .select(PASSPORT, DocumentUpload.class)
                .clickUploadButton(ImageQualityGuide.class)
                .upload(PASSPORT_JPG)
                .clickConfirmButton(FaceVideoIntro.class)
                .recordVideo()
                .clickEnableCamera(FaceVideo.class)
                .back(FaceVideoIntro.class);

    }
}