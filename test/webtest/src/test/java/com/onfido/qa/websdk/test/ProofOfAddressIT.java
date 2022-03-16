package com.onfido.qa.websdk.test;

import com.onfido.qa.websdk.DocumentType;
import com.onfido.qa.websdk.PoADocumentType;
import com.onfido.qa.websdk.UploadDocument;
import com.onfido.qa.websdk.model.DocumentOption;
import com.onfido.qa.websdk.page.Complete;
import com.onfido.qa.websdk.page.CrossDeviceClientIntro;
import com.onfido.qa.websdk.page.CrossDeviceClientSuccess;
import com.onfido.qa.websdk.page.CrossDeviceMobileConnected;
import com.onfido.qa.websdk.page.CrossDeviceSubmit;
import com.onfido.qa.websdk.page.DocumentUpload;
import com.onfido.qa.websdk.page.IdDocumentSelector;
import com.onfido.qa.websdk.page.ImageQualityGuide;
import com.onfido.qa.websdk.page.PoADocumentSelection;
import com.onfido.qa.websdk.page.PoAIntro;
import com.onfido.qa.websdk.sdk.Raw;
import org.testng.SkipException;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.util.Arrays;
import java.util.EnumMap;
import java.util.Map;

import static com.onfido.qa.websdk.PoADocumentType.BANK_BUILDING_SOCIETY_STATEMENT;
import static com.onfido.qa.websdk.PoADocumentType.BENEFIT_LETTERS;
import static com.onfido.qa.websdk.PoADocumentType.COUNCIL_TAX;
import static com.onfido.qa.websdk.PoADocumentType.UTILITY_BILL;
import static com.onfido.qa.websdk.PoADocumentType.values;
import static com.onfido.qa.websdk.UploadDocument.NATIONAL_IDENTITY_CARD_PDF;
import static com.onfido.qa.websdk.UploadDocument.PASSPORT_JPG;
import static com.onfido.qa.websdk.UploadDocument.UK_DRIVING_LICENCE_PNG;
import static com.onfido.qa.websdk.DocumentType.PASSPORT;
import static org.assertj.core.api.Assertions.assertThat;

@SuppressWarnings("StaticCollection")
public class ProofOfAddressIT extends WebSdkIT {

    @DataProvider(name = "poaDocumentTypes")
    public static Object[][] poaDocumentTypes() {

        return Arrays.stream(values()).map(x -> {
            return new Object[]{x};
        }).toArray(Object[][]::new);
    }

    final static Map<PoADocumentType, DocumentOption> expectedOptions = new EnumMap<>(PoADocumentType.class);
    final static Map<PoADocumentType, String> expectedTitle = new EnumMap<>(PoADocumentType.class);

    static {
        expectedOptions.put(BANK_BUILDING_SOCIETY_STATEMENT, new DocumentOption("Bank or building society statement", null, null, true));
        expectedOptions.put(UTILITY_BILL, new DocumentOption("Utility Bill", "Gas, electricity, water, landline, or broadband", "Sorry, no mobile phone bills", true));
        expectedOptions.put(COUNCIL_TAX, new DocumentOption("Council Tax Letter", null, null, false));
        expectedOptions.put(BENEFIT_LETTERS, new DocumentOption("Benefits Letter", "Government authorised household benefits eg. Jobseeker allowance, Housing benefit, Tax credits", null, false));

        expectedTitle.put(BANK_BUILDING_SOCIETY_STATEMENT, "doc_submit.title_bank_statement");
        expectedTitle.put(UTILITY_BILL, "doc_submit.title_bill");
        expectedTitle.put(COUNCIL_TAX, "doc_submit.title_tax_letter");
        expectedTitle.put(BENEFIT_LETTERS, "doc_submit.title_benefits_letter");

    }

    @Test(description = "should verify PoA flow for different poa document types", dataProvider = "poaDocumentTypes")
    public void testPoAUIElements(PoADocumentType documentType) {

        // TODO: bootstrap with an applicant from country, that is required by the document type
        if (!documentType.availableInCountry("GBR")) {
            throw new SkipException(String.format("Cannot execute test, as the document type '%s' is not available in this country", documentType.name()));
        }

        var intro = onfido().withSteps("poa", "complete").init(PoAIntro.class);

        assertThat(intro.title()).isEqualTo("Let’s verify your UK address");

        verifyCopy(intro.requirementsHeader(), "poa_intro.subtitle");
        assertThat(intro.firstRequirement()).isEqualTo("Shows your current address");
        assertThat(intro.secondRequirement()).isEqualTo("Matches the address you used on signup");
        assertThat(intro.thirdRequirement()).isEqualTo("Is your most recent document");

        verifyCopy(intro.startVerificationButtonText(), "poa_intro.button_primary");

        var documentSelection = intro.startVerification();

        assertThat(documentSelection.title()).isEqualTo("Select a UK document");
        verifyCopy(documentSelection.subTitle(), "doc_select.subtitle_poa");

        var option = documentSelection.getOption(documentType);
        assertThat(option).isEqualTo(expectedOptions.get(documentType));

        var guidance = documentSelection.select(documentType);

        verifyCopy(guidance.title(), expectedTitle.get(documentType));
        verifyCopy(guidance.makeSure(), "poa_guidance.instructions.label");
        verifyCopy(guidance.logoText(), "poa_guidance.instructions.logo");
        verifyCopy(guidance.continueButtonText(), "poa_guidance.button_primary");

        var upload = guidance.clickContinue();

        upload.upload(NATIONAL_IDENTITY_CARD_PDF).clickConfirmButton(Complete.class);
    }

    @Test(description = "should skip country selection screen with a preselected driver's license document type on PoA flow", groups = {"percy"})
    public void testShouldSkipCountrySelectionScreenWithAPreselectedDriverSLicenseDocumentTypeOnPoAFlow() {

        var upload = onfido().withSteps("poa").init(PoAIntro.class)
                             .startVerification()
                             .select(COUNCIL_TAX)
                             .clickContinue();

        takePercySnapshot("ProofOfAddress-SubmitLetter");

        upload.upload(UK_DRIVING_LICENCE_PNG);

    }

    @Test(description = "should successfully complete cross device e2e flow with PoA document and selfie upload", groups = {"percy", "tabs"})
    public void testShouldSuccessfullyCompleteCrossDeviceE2EFlowWithPoADocumentAndSelfieUpload() {

        var crossDeviceLink = onfido().withSteps("poa", "complete").init(PoAIntro.class)
                                      .startVerification()
                                      .select(BANK_BUILDING_SOCIETY_STATEMENT)
                                      .clickContinue().switchToCrossDevice()
                                      .getSecureLink();

        assertThat(crossDeviceLink.isQrCodeIsDisplayed()).isTrue();

        openMobileScreen(crossDeviceLink.copyLink());

        var intro = verifyPage(CrossDeviceClientIntro.class);

        switchToMainScreen();
        verifyPage(CrossDeviceMobileConnected.class);

        switchToMobileScreen();
        intro.clickContinue(DocumentUpload.class)
             .upload(PASSPORT_JPG)
             .clickConfirmButton(CrossDeviceClientSuccess.class);

        switchToMainScreen();
        verifyPage(CrossDeviceSubmit.class).submitVerification(Complete.class);

    }

    @Test(description = "should allow PoA together with Document")
    public void testPoaTogetherWithDocument() {
        onfido().withSteps("poa", "document", "complete")
                .withOnComplete(new Raw("(data) => window.areDocsCorrect = data.poa && data.document_front && data.poa.id !== data.document_front.id"))
                .init(PoAIntro.class)
                .startVerification()
                .select(BANK_BUILDING_SOCIETY_STATEMENT)
                .clickContinue()
                .upload(NATIONAL_IDENTITY_CARD_PDF)
                .clickConfirmButton(IdDocumentSelector.class)
                .select(PASSPORT, DocumentUpload.class)
                .clickUploadButton(ImageQualityGuide.class)
                .upload(PASSPORT_JPG)
                .clickConfirmButton(Complete.class);

        assertThat((Boolean) driver().executeScript("return window.areDocsCorrect")).isTrue();
    }
}
