/* leny/enigjewo
 *
 * /src/components/game/top-bar.js - Game TopBar
 *
 * coded by leny@BeCode
 * started at 02/02/2021
 */

import "styles/game/top-bar.scss";

import classnames from "classnames";
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {useTimer} from "core/hooks/use-timer";
import useSound from "use-sound";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBell, faBellSlash} from "@fortawesome/free-solid-svg-icons";

import {noop, preventDefault, invertValue} from "core/utils";

import {NBSP} from "core/constants";

import halfTimeAlert from "sounds/half-time.mp3";
import thirtySecondsRemainingAlert from "sounds/thirty-seconds-remaining.mp3";

const TopBar = ({
    rounds: {duration, current, total},
    score = 0,
    onTimerFinished = noop,
}) => {
    const [withSoundAlerts, setWithSoundAlerts] = useState(true);
    const [timerColorClassName, setTimerColorClassName] = useState(false);
    const [{seconds, running}] = useTimer(duration, true, onTimerFinished);
    const [playHalfTimeAlert] = useSound(halfTimeAlert);
    const [playThirtySecondsRemainingAlert] = useSound(
        thirtySecondsRemainingAlert,
    );

    useEffect(() => {
        if (!running) {
            return;
        }

        if (seconds === duration) {
            setTimerColorClassName(false);
        }

        if (duration / 2 > 60 && seconds === duration / 2) {
            withSoundAlerts && playHalfTimeAlert();
            setTimerColorClassName("has-text-warning");
        }

        if (duration > 120 && seconds === 30) {
            withSoundAlerts && playThirtySecondsRemainingAlert();
            setTimerColorClassName("has-text-danger");
        }
    }, [
        seconds,
        running,
        duration,
        withSoundAlerts,
        playHalfTimeAlert,
        playThirtySecondsRemainingAlert,
        setTimerColorClassName,
    ]);

    return (
        <div
            className={classnames(
                "top-bar",
                "is-dark",
                "notification",
                "is-flex",
                "is-flex-direction-row",
                "is-justify-content-space-between",
                "is-align-items-center",
            )}>
            <span
                className={classnames(
                    "is-flex",
                    "is-flex-direction-row",
                    "is-justify-content-flex-start",
                    "is-align-items-center",
                )}>
                <a
                    href={"#"}
                    onClick={preventDefault(() =>
                        setWithSoundAlerts(invertValue),
                    )}
                    className={classnames(
                        "icon",
                        !withSoundAlerts && "has-text-grey",
                    )}
                    title={
                        withSoundAlerts ? "Disable alerts" : "Enable alerts"
                    }>
                    <FontAwesomeIcon
                        icon={withSoundAlerts ? faBell : faBellSlash}
                    />
                </a>
                <strong className={classnames(timerColorClassName)}>
                    {String(Math.floor(seconds / 60)).padStart(2, "0")}
                    <span
                        className={classnames(seconds % 2 && "has-text-grey")}>
                        {":"}
                    </span>
                    {String(seconds % 60).padStart(2, "0")}
                </strong>
            </span>
            <span className={classnames("top-bar__rounds")}>
                <span className={classnames("has-text-grey")}>{"Round:"}</span>
                {NBSP}
                <strong>{`${current} / ${total}`}</strong>
            </span>
            <span className={classnames("top-bar__score")}>
                <span className={classnames("has-text-grey")}>{"Score:"}</span>
                {NBSP}
                <strong>{score}</strong>
            </span>
        </div>
    );
};

TopBar.propTypes = {
    rounds: PropTypes.shape({
        duration: PropTypes.number.isRequired,
        current: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
    }).isRequired,
    score: PropTypes.number.isRequired,
    onTimerFinished: PropTypes.func,
};

export default TopBar;