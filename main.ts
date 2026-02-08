//% color="#FF6600" icon="\uf1b9"
namespace RobotPro {

    let baseSpeed = 600
    let Kp = 0
    let Ki = 0
    let Kd = 0

    let lastError = 0
    let integral = 0

    // =====================
    // ⚙️ ตั้งค่าความเร็ว
    // =====================
    //% block="ตั้งความเร็วพื้นฐาน %speed"
    export function setBaseSpeed(speed: number) {
        baseSpeed = speed
    }

    // =====================
    // 🚗 มอเตอร์พื้นฐาน
    // =====================

    //% block="เดินหน้า"
    export function forward() {
        pins.analogWritePin(AnalogPin.P13, baseSpeed)
        pins.analogWritePin(AnalogPin.P14, baseSpeed)
    }

    //% block="หยุด"
    export function stop() {
        pins.digitalWritePin(DigitalPin.P13, 0)
        pins.digitalWritePin(DigitalPin.P14, 0)
    }

    //% block="เลี้ยวซ้าย"
    export function turnLeft() {
        pins.analogWritePin(AnalogPin.P13, 0)
        pins.analogWritePin(AnalogPin.P14, baseSpeed)
    }

    //% block="เลี้ยวขวา"
    export function turnRight() {
        pins.analogWritePin(AnalogPin.P13, baseSpeed)
        pins.analogWritePin(AnalogPin.P14, 0)
    }

    // =====================
    // 🔍 อ่านเซ็นเซอร์
    // =====================

    //% block="อ่านซ้าย"
    export function readLeft(): number {
        return pins.digitalReadPin(DigitalPin.P1)
    }

    //% block="อ่านกลาง"
    export function readCenter(): number {
        return pins.digitalReadPin(DigitalPin.P8)
    }

    //% block="อ่านขวา"
    export function readRight(): number {
        return pins.digitalReadPin(DigitalPin.P16)
    }

    // =====================
    // 🧭 ตามเส้นธรรมดา
    // =====================
    //% block="ตามเส้นธรรมดา"
    export function followLineBasic() {

        let L = readLeft()
        let R = readRight()

        if (L == 0 && R == 0) {
            forward()
        }
        else if (L == 1) {
            turnLeft()
        }
        else if (R == 1) {
            turnRight()
        }
    }

    // =====================
    // 🧠 ตั้งค่า PID
    // =====================
    //% block="ตั้งค่า PID Kp %kp Ki %ki Kd %kd"
    export function setPID(kp: number, ki: number, kd: number) {
        Kp = kp
        Ki = ki
        Kd = kd
    }

    // =====================
    // 🎯 ตามเส้น PID
    // =====================
    //% block="ตามเส้น PID"
    export function followLinePID() {

        let L = readLeft()
        let C = readCenter()
        let R = readRight()

        let error = 0

        if (L == 1) error = -1
        if (R == 1) error = 1
        if (C == 1) error = 0

        integral += error
        let derivative = error - lastError

        let correction = Kp * error + Ki * integral + Kd * derivative

        let leftSpeed = baseSpeed + correction
        let rightSpeed = baseSpeed - correction

        pins.analogWritePin(AnalogPin.P13, leftSpeed)
        pins.analogWritePin(AnalogPin.P14, rightSpeed)

        lastError = error
    }

    // =====================
    // 🏁 โหมดแข่ง
    // =====================
    //% block="โหมดแข่ง"
    export function raceMode() {

        setBaseSpeed(800)
        followLinePID()
    }

}