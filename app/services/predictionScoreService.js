
import {
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    doc
} from "firebase/firestore"

const getWinner = (match) => {

    if (match.homeScore === match.awayScore) {
        return "draw"
    }

    return match.homeScore > match.awayScore
        ? match.homeTeam
        : match.awayTeam

}

export const calculatePredictionPoints = (
    match,
    prediction
) => {

    const exactScore =
        match.homeScore === prediction.homePrediction &&
        match.awayScore === prediction.awayPrediction

    if (exactScore) {
        return 50
    }

    const winnerCorrect =
        getWinner(match) === prediction.predictedWinner

    if (winnerCorrect) {
        return 25
    }

    return 0

}

export const evaluatePrediction = (
    match,
    prediction
) => {

    return {
        points: calculatePredictionPoints(
            match,
            prediction
        ),
        evaluated: true
    }
}

export const resetPredictionEvaluation = () => {
    return {
        points: 0,
        evaluated: false
    }
}

export const updatePredictionScores = async (match) => {
console.log("Entró a updatePredictionScores", match)
    const { $db } = useNuxtApp()

    const predictionsQuery = query(
        collection($db, "predictions"),
        where("matchId", "==", match.id)
    )

    const snapshot = await getDocs(predictionsQuery)
    for (const predictionDocument of snapshot.docs) {

        const prediction = {
            id: predictionDocument.id,
            ...predictionDocument.data()
        }
        const data =
            match.status === "Finalizado"
                ? evaluatePrediction(match, prediction)
                : resetPredictionEvaluation()
        await updateDoc(
            doc($db, "predictions", prediction.id),
            data
        )
    }
}