
import React from 'react';

const PrivacyPolicy: React.FC = () => {
    return (
        <>
            <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
            <p>CITADINE D'60 s'engage à ce que la collecte et le traitement de vos données, effectués à partir du site citadined60.com, soient conformes au règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés.</p>

            <h3>1. Collecte des données personnelles</h3>
            <p>Nous collectons les données suivantes dans le cadre de la création de compte et de la réservation :</p>
            <ul>
                <li>Nom et prénom</li>
                <li>Adresse e-mail</li>
                <li>Numéro de téléphone</li>
                <li>Documents d'identité (permis de conduire, carte d'identité, justificatif de domicile)</li>
            </ul>
            <p>Ces informations sont nécessaires pour valider votre réservation, éditer le contrat de location et assurer la sécurité de nos véhicules.</p>

            <h3>2. Finalité du traitement des données</h3>
            <p>Vos données personnelles sont utilisées pour :</p>
            <ul>
                <li>Gérer votre réservation et votre contrat de location.</li>
                <li>Communiquer avec vous concernant votre location.</li>
                <li>Assurer le respect des conditions légales et réglementaires de la location de véhicule.</li>
                <li>Lutter contre la fraude.</li>
            </ul>

            <h3>3. Durée de conservation des données</h3>
            <p>Vos données de réservation sont conservées pour la durée nécessaire à l'exécution du contrat, et ensuite archivées conformément aux obligations légales (notamment comptables et fiscales) pour une durée maximale de 5 ans.</p>

            <h3>4. Sécurité de vos données</h3>
            <p>Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données personnelles contre la perte, l'altération, la divulgation ou l'accès non autorisé.</p>

            <h3>5. Vos droits sur vos données</h3>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul>
                <li>Droit d'accès : Vous pouvez demander à consulter les données que nous détenons sur vous.</li>
                <li>Droit de rectification : Vous pouvez demander la correction de données inexactes.</li>
                <li>Droit à l'effacement (ou "droit à l'oubli") : Vous pouvez demander la suppression de vos données, sous réserve de nos obligations légales.</li>
                <li>Droit à la limitation du traitement.</li>
                <li>Droit à la portabilité de vos données.</li>
            </ul>
            <p>Pour exercer ces droits, vous pouvez nous contacter à l'adresse e-mail : contact@citadined60.com.</p>

            <h3>6. Cookies</h3>
            <p>Notre site utilise des cookies essentiels à son fonctionnement. Nous n'utilisons pas de cookies de suivi publicitaire sans votre consentement explicite.</p>
        </>
    );
};

export default PrivacyPolicy;
