export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            error: "Methode nicht erlaubt."
        });
    }

    try {

        const {
            discordName,
            reason
        } = req.body;


        if (!discordName || !reason) {

            return res.status(400).json({
                success: false,
                error: "Bitte fülle alle Felder aus."
            });

        }


        const webhookUrl =
            process.env.DISCORD_WEBHOOK_URL;


        if (!webhookUrl) {

            console.error(
                "DISCORD_WEBHOOK_URL fehlt."
            );

            return res.status(500).json({
                success: false,
                error: "Discord Webhook ist nicht konfiguriert."
            });

        }


        const response =
            await fetch(webhookUrl, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    username:
                        "Traum2 Giveaway",

                    embeds: [

                        {

                            title:
                                "🎉 Neue Giveaway-Teilnahme!",

                            description:
                                "Eine neue Teilnahme am Traum2 300-Member-Giveaway.",

                            color:
                                10181046,

                            fields: [

                                {
                                    name:
                                        "👤 Discord Name",

                                    value:
                                        discordName,

                                    inline:
                                        true
                                },

                                {
                                    name:
                                        "💭 Warum möchte die Person gewinnen?",

                                    value:
                                        reason,

                                    inline:
                                        false
                                }

                            ],

                            footer: {

                                text:
                                    "Traum2 • 300 Member Giveaway"

                            },

                            timestamp:
                                new Date().toISOString()

                        }

                    ]

                })

            });


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Discord Fehler:",
                response.status,
                errorText
            );

            return res.status(500).json({
                success: false,
                error: "Discord konnte die Teilnahme nicht empfangen."
            });

        }


        return res.status(200).json({
            success: true
        });


    } catch (error) {

        console.error(
            "Giveaway Fehler:",
            error
        );

        return res.status(500).json({
            success: false,
            error: "Die Teilnahme konnte nicht gesendet werden."
        });

    }

}