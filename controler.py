import numpy as np
import win32api
import win32con
import math


def truncate(x, mmin, mmax):
    if x < mmin:
        return mmin
    elif x > mmax:
        return mmax
    else:
        return x


class mouse:
    def moveTo(self, x, y):
        win32api.SetCursorPos((x, y))

    def drag(self, x, y):
        win32api.SetCursorPos((x, y))
        win32api.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN,
                             x, y, 0, 0)

    def dragEnd(self, x, y):
        win32api.SetCursorPos((x, y))
        win32api.mouse_event(win32con.MOUSEEVENTF_LEFTUP,
                             x, y, 0, 0)

    def clickLeft(self, x, y):
        win32api.SetCursorPos((x, y))
        win32api.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN,
                             x, y, 0, 0)
        win32api.mouse_event(win32con.MOUSEEVENTF_LEFTUP,
                             x, y, 0, 0)

    def clickRight(self, x, y):
        win32api.SetCursorPos((x, y))
        win32api.mouse_event(win32con.MOUSEEVENTF_RIGHTDOWN,
                             x, y, 0, 0)
        win32api.mouse_event(win32con.MOUSEEVENTF_RIGHTUP,
                             x, y, 0, 0)


class parser:
    def __init__(self):
        self.x, self.y = round(1280 / 2), round(720 / 2)
        self.dx, self.dy = 0, 0
        self.pressure = 1
        self.event = ""
        self.prev_event = ""

    def parse(self, message):
        if(message.find(",") != -1):
            data = message.split(",")
            self.prev_event = self.event
            self.event = data.pop()
            data = [int(i) for i in data]
            # data format = dx,dy,pressure,event
            self.dx = data[0]
            self.dy = data[1]
            accx = math.exp(0.05 * abs(self.dx))
            accy = math.exp(0.05 * abs(self.dy))
            self.x = truncate(round(self.x + accx * self.dx), 0, 1280)
            self.y = truncate(round(self.y + accy * self.dy), 0, 720)
            self.pressure = data[2]


if __name__ == "__main__":
    import controler
    p = controler.parser()
    m = controler.mouse()
    p.parse("-1,2,3,hra")
    print(p.event)
    print(p.x, p.y)
