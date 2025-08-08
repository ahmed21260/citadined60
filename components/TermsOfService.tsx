
import React from 'react';

const TermsOfService: React.FC = () => {
    return (
        <>
            <h3>Article 1 : Conditions pour louer</h3>
            <p>Le locataire doit être âgé d'au moins 21 ans et être titulaire d'un permis de conduire de catégorie B en cours de validité depuis au moins 2 ans. Les documents originaux (permis de conduire, pièce d'identité) devront être présentés avant la remise des clés. Une copie sera conservée pour la durée de la location.</p>

            <h3>Article 2 : Réservation et Paiement</h3>
            <p>La réservation est confirmée après paiement en ligne. Le paiement peut être effectué par carte bancaire via notre partenaire de paiement sécurisé Stripe. Le montant total de la location est dû au moment de la réservation pour garantir le véhicule.</p>
            
            <h3>Article 3 : Dépôt de garantie (Caution)</h3>
            <p>Un dépôt de garantie de 800€ est exigé pour toutes nos citadines. Il est réalisé par pré-autorisation sécurisée via Stripe (le montant n'est pas débité). Cette somme est destinée à couvrir les éventuels dommages au véhicule, les frais de carburant manquant ou les pénalités pour retard. La pré-autorisation est automatiquement annulée par notre système après la restitution du véhicule si aucune anomalie n'est constatée.</p>

            <h3>Article 4 : Utilisation du Véhicule</h3>
            <p>Le locataire s'engage à utiliser le véhicule en "bon père de famille". Il est interdit de sous-louer le véhicule, de l'utiliser pour des compétitions, pour le transport de marchandises à titre onéreux ou pour des activités illégales. Le véhicule ne peut être conduit que par le locataire principal déclaré au contrat, ou par des conducteurs additionnels approuvés par CITADINE D'60.</p>

            <h3>Article 5 : Assurance</h3>
            <p>Nos véhicules sont assurés au tiers. En cas de dommage responsable ou sans tiers identifié, votre responsabilité financière est limitée au montant du dépôt de garantie (franchise), soit 800€.</p>

            <h3>Article 6 : Restitution du Véhicule</h3>
            <p>Le véhicule doit être restitué à la date et à l'heure convenues au contrat. Tout retard de plus de 60 minutes pourra entraîner la facturation d'une journée de location supplémentaire. Le véhicule doit être retourné avec le même niveau de carburant qu'au départ. À défaut, le carburant manquant sera facturé au tarif en vigueur, majoré de frais de service de 15€.</p>

            <h3>Article 7 : Annulation</h3>
            <p>
                - Annulation plus de 7 jours avant le début de la location : remboursement intégral.<br />
                - Annulation entre 7 jours et 48 heures avant le début : 50% du montant total est retenu.<br />
                - Annulation moins de 48 heures avant le début : le montant total de la location est conservé.
            </p>

            <h3>Article 8 : Litiges</h3>
            <p>En cas de litige, les parties s'engagent à chercher une solution amiable. À défaut, le tribunal compétent sera celui du lieu du siège social de CITADINE D'60.</p>
        </>
    );
};

export default TermsOfService;