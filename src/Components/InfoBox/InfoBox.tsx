import React from 'react';
import './InfoBox.css';
import { Card, CardContent, Typography } from "@material-ui/core";

interface infoBoxProps {
    onClick: any,
    title: string,
    cases: string,
    total: string, 
    active: boolean
  }

function InfoBox(props: infoBoxProps) {
    const { onClick, title, cases, total, active} = props

    const handleChanges = async () => {
        await onClick()
    }

    return (
        <Card 
            onClick = {handleChanges}
            className={`infoBox ${active && "infoBox--red"}`}>
            <CardContent>
                <Typography>
                    {title}
                </Typography>
                <h2>
                    {cases} 
                </h2>
                <Typography>
                    {total} Total 
                </Typography>
            </CardContent>
        </Card>
    );
}

export default InfoBox
